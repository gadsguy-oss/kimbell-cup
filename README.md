# Kimbell Cup Invitational

Scoring, contests, and the record book for the Kimbell Cup Invitational 2-man scramble. Est. 1983.

A single static HTML file. No build step, no dependencies, no framework. Open `index.html` in a browser and it runs.

## What it does

- **Card** — hole-by-hole scramble scoring, one gross score per hole, with drive-used and mulligan tracking per player
- **Board** — live leaderboard across the field, ties broken by regression on hole handicap
- **Prizes** — four closest-to-the-pin holes, long drive, putting contest
- **Cup** — champions by year, record book, format, course card, pairings
- **Setup** — course, scorecard, pairings, prizes, and rolling the event into a new year

## Storage

The app has two storage backends and picks one automatically:

| Backend | When | Behavior |
|---|---|---|
| `cloud` | Running as a Claude artifact | Shared storage — the whole field writes to one board |
| `device` | Hosted anywhere else | `localStorage` — each browser keeps its own data |

On the open web it runs in `device` mode and says so on the Board tab. **The multi-phone live leaderboard does not work in `device` mode.** Making it work on a real domain means adding a backend — see below.

## Adding a real backend

The storage layer is one object, near the top of the `<script>` block:

```js
const store = {
  cloud: typeof window !== 'undefined' && !!window.storage,
  get mode(){ ... },
  async get(key, shared){ ... },
  async set(key, value, shared){ ... }
};
```

Everything in the app goes through `store.get` and `store.set`. To put it on a shared database, replace the `device` branch of those two methods with `fetch` calls to an API route. Nothing else in the app has to change.

Keys are namespaced by year:

```
kc:index              → { activeYear, years: [] }
kc:evt:{year}         → event config: course, holes, teams, prizes, status
kc:sc:{year}:{teamId} → one team's card
kc:ct:{year}          → contest results
kc:champs             → champions across all years
kc:me                 → which team this device is scoring (never shared)
```

A key/value store is enough. Vercel KV, Upstash Redis, or a single Postgres table with `key` and `value` columns all work.

## Deploying

Static hosting, anywhere. Vercel, Netlify, GitHub Pages, or a folder on any web server.

There's no build command and no output directory — point the host at the repo root and serve `index.html`.

## Running it

See `ADMIN-GUIDE.md` for the tournament host's walkthrough: setting up a year, running the day, crowning the champion, and opening next December.
