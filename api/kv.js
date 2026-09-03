/**
 * Kimbell Cup — shared storage API
 *
 * Talks to a Redis (Upstash) instance over its REST API. Accepts whichever
 * env var names Vercel injected, so it works whether the store was added as
 * Vercel KV or as Upstash from the Marketplace.
 *
 * Routes
 *   GET  /api/kv?ping=1                     → { ok, configured }
 *   GET  /api/kv?key=KEY                    → { value }
 *   GET  /api/kv?hash=HASH                  → { values: { field: value } }
 *   GET  /api/kv?hash=HASH&field=F          → { value }
 *   POST /api/kv  { key, value }            → { ok }
 *   POST /api/kv  { hash, field, value }    → { ok }
 */

const URL_VAR =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.REDIS_REST_API_URL ||
  '';

const TOKEN_VAR =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.REDIS_REST_API_TOKEN ||
  '';

const configured = Boolean(URL_VAR && TOKEN_VAR);

async function redis(command) {
  const res = await fetch(URL_VAR, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN_VAR}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const json = await res.json();
  return json.result;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.query && req.query.ping) {
    return res.status(200).json({ ok: true, configured });
  }

  if (!configured) {
    return res.status(503).json({
      ok: false,
      configured: false,
      error: 'No Redis store connected to this project.'
    });
  }

  try {
    if (req.method === 'GET') {
      const { key, hash, field } = req.query;

      if (hash && field) {
        const value = await redis(['HGET', hash, String(field)]);
        return res.status(200).json({ value: value ?? null });
      }

      if (hash) {
        const flat = (await redis(['HGETALL', hash])) || [];
        const values = {};
        for (let i = 0; i < flat.length; i += 2) values[flat[i]] = flat[i + 1];
        return res.status(200).json({ values });
      }

      if (key) {
        const value = await redis(['GET', key]);
        return res.status(200).json({ value: value ?? null });
      }

      return res.status(400).json({ error: 'key or hash required' });
    }

    if (req.method === 'POST') {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const { key, hash, field, value } = body;

      if (typeof value !== 'string') {
        return res.status(400).json({ error: 'value must be a string' });
      }
      if (value.length > 400000) {
        return res.status(413).json({ error: 'value too large' });
      }

      if (hash && field !== undefined) {
        await redis(['HSET', hash, String(field), value]);
        return res.status(200).json({ ok: true });
      }

      if (key) {
        await redis(['SET', key, value]);
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'key or hash+field required' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
