/**
 * Kimbell Cup — shared storage API with per-team write codes.
 *
 * Reads are open: anyone with the link can watch the leaderboard.
 * Writes are checked here, on the server. Codes are never sent to a browser,
 * so reading the page source tells you nothing.
 *
 *   GET  /api/kv?ping=1                   -> { ok, configured, claimed }
 *   GET  /api/kv?key=KEY                  -> { value }
 *   GET  /api/kv?hash=HASH[&field=F]      -> { values } | { value }
 *   POST /api/kv { action:'claim', admin }
 *   POST /api/kv { action:'verify', scope:'admin'|'team', year, team, code }
 *   POST /api/kv { action:'codes', admin, year }         -> { codes }
 *   POST /api/kv { action:'setcodes', admin, year, codes }
 *   POST /api/kv { key|hash+field, value, auth:{ admin, code } }
 */

const URL_VAR =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.REDIS_REST_API_URL || '';

const TOKEN_VAR =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.REDIS_REST_API_TOKEN || '';

const ENV_ADMIN = process.env.ADMIN_CODE || '';
const configured = Boolean(URL_VAR && TOKEN_VAR);

const ADMIN_KEY = 'kc:admin';
const codesKey = (y) => `kc:codes:${y}`;
const PRIVATE = /^kc:(admin|codes)/;

async function redis(command) {
  const res = await fetch(URL_VAR, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN_VAR}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  if (!res.ok) throw new Error('redis ' + res.status);
  return (await res.json()).result;
}

const norm = (v) => String(v == null ? '' : v).trim().toUpperCase();

async function storedAdmin() {
  if (ENV_ADMIN) return norm(ENV_ADMIN);
  return norm(await redis(['GET', ADMIN_KEY]));
}
async function isAdmin(code) {
  const want = await storedAdmin();
  return Boolean(want) && norm(code) === want;
}
async function isTeam(year, team, code) {
  if (!year || team === undefined) return false;
  const want = norm(await redis(['HGET', codesKey(year), String(team)]));
  return Boolean(want) && norm(code) === want;
}

function targetOf(body) {
  const { hash, field, key } = body;
  const m = hash && /^kc:cards:(\d+)$/.exec(hash);
  if (m && field !== undefined) return { kind: 'team', year: m[1], team: String(field) };
  if (hash && PRIVATE.test(hash)) return { kind: 'blocked' };
  if (key && PRIVATE.test(key)) return { kind: 'blocked' };
  return { kind: 'admin' };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.query && req.query.ping) {
    let claimed = false;
    if (configured) { try { claimed = Boolean(await storedAdmin()); } catch (e) {} }
    return res.status(200).json({ ok: true, configured, claimed });
  }
  if (!configured) {
    return res.status(503).json({ ok: false, configured: false, error: 'No Redis store connected.' });
  }

  try {
    if (req.method === 'GET') {
      const { key, hash, field } = req.query;
      if ((key && PRIVATE.test(key)) || (hash && PRIVATE.test(hash))) {
        return res.status(403).json({ error: 'not readable' });
      }
      if (hash && field) {
        return res.status(200).json({ value: (await redis(['HGET', hash, String(field)])) ?? null });
      }
      if (hash) {
        const flat = (await redis(['HGETALL', hash])) || [];
        const values = {};
        for (let i = 0; i < flat.length; i += 2) values[flat[i]] = flat[i + 1];
        return res.status(200).json({ values });
      }
      if (key) {
        return res.status(200).json({ value: (await redis(['GET', key])) ?? null });
      }
      return res.status(400).json({ error: 'key or hash required' });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'method not allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const action = body.action;

    if (action === 'claim') {
      if (ENV_ADMIN) return res.status(409).json({ error: 'admin code lives in project settings' });
      if (await storedAdmin()) return res.status(409).json({ error: 'already claimed' });
      const code = norm(body.admin);
      if (code.length < 4) return res.status(400).json({ error: 'code too short' });
      await redis(['SET', ADMIN_KEY, code]);
      return res.status(200).json({ ok: true });
    }

    if (action === 'verify') {
      const ok = body.scope === 'admin'
        ? await isAdmin(body.code)
        : await isTeam(body.year, body.team, body.code);
      return res.status(ok ? 200 : 401).json({ ok });
    }

    if (action === 'codes') {
      if (!(await isAdmin(body.admin))) return res.status(401).json({ error: 'bad admin code' });
      const flat = (await redis(['HGETALL', codesKey(body.year)])) || [];
      const codes = {};
      for (let i = 0; i < flat.length; i += 2) codes[flat[i]] = flat[i + 1];
      return res.status(200).json({ codes });
    }

    if (action === 'setcodes') {
      if (!(await isAdmin(body.admin))) return res.status(401).json({ error: 'bad admin code' });
      const codes = body.codes || {};
      const args = [];
      Object.keys(codes).forEach((k) => { args.push(String(k), norm(codes[k])); });
      if (!args.length) return res.status(400).json({ error: 'no codes' });
      await redis(['DEL', codesKey(body.year)]);
      await redis(['HSET', codesKey(body.year)].concat(args));
      return res.status(200).json({ ok: true });
    }

    const { key, hash, field, value } = body;
    const auth = body.auth || {};
    if (typeof value !== 'string') return res.status(400).json({ error: 'value must be a string' });
    if (value.length > 400000) return res.status(413).json({ error: 'value too large' });

    const target = targetOf(body);
    if (target.kind === 'blocked') return res.status(403).json({ error: 'not writable' });

    let allowed = await isAdmin(auth.admin);

    if (!allowed && target.kind === 'team') {
      allowed = await isTeam(target.year, target.team, auth.code);
      if (!allowed) {
        // No codes issued for this year yet — stay open so setup can happen.
        const n = await redis(['HLEN', codesKey(target.year)]);
        if (!Number(n)) allowed = true;
      }
    }
    if (!allowed && target.kind === 'admin' && !(await storedAdmin())) allowed = true;

    if (!allowed) return res.status(401).json({ error: 'code required' });

    if (hash && field !== undefined) await redis(['HSET', hash, String(field), value]);
    else if (key) await redis(['SET', key, value]);
    else return res.status(400).json({ error: 'key or hash+field required' });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
