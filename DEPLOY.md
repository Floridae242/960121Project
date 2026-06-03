# Deployment Guide — แป้งละออง (Pang-La-Ong)

This app goes live as a **single Node process**: Express serves the REST API **and** the
built React frontend from the same origin (no separate static host, no CORS needed in prod).

## What you need

1. **A Node host** that runs a long-lived process (Render, Railway, Fly.io, a VPS, etc.).
   Serverless/edge (e.g. plain Vercel functions) does **not** fit — this is a stateful
   Express + MySQL server.
2. **A managed MySQL / MariaDB** reachable over TCP (Aiven, Railway, Clever Cloud, PlanetScale,
   AWS RDS, …). Your local XAMPP/Homebrew DB is **not** reachable from the internet.
3. Node 18+.

## How production serving works

- `npm run start:prod` → `npm run build` (builds the frontend to `/dist`) → `node server.js`.
- `server.js` serves `/dist` as static files and falls back to `index.html` for non-`/api`
  routes (SPA routing). The static-serve only activates when a build exists, so dev is
  unaffected.
- The app honors `process.env.PORT` (hosts inject their own).

## Steps

### 1. Provision a MySQL database
Create a database named `panglaong_db` on your managed MySQL and note host/port/user/password.

### 2. Load the schema + seed
From your machine (or a one-off job), point `backend/.env` at the cloud DB (TCP) and run:
```bash
cd backend
npm install
npm run init-db          # creates tables + seed against the cloud MySQL
```
> `init-db` uses your `.env`. For the cloud DB, set `DB_HOST`/`DB_PORT` and leave `DB_SOCKET` unset.

### 3. Configure production env
Copy `backend/.env.production.example` → set it as your host's environment variables
(or `backend/.env` on the server). At minimum:
- `NODE_ENV=production`
- `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASS` / `DB_NAME` (the cloud DB)
- `JWT_SECRET` — generate a fresh one:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

### 4. Build & start
On the host, the two commands are:
- **Install:** `npm install && npm install --prefix backend`
- **Build + start:** `cd backend && npm run start:prod`

(Or build the frontend in CI: `npm run build`, then run `node backend/server.js`.)

### 5. HTTPS
Terminate TLS at your host's proxy/load balancer (Render/Railway/Fly do this for you).
The app sets `trust proxy` so it works correctly behind one.

## Security (already wired in)

- **Helmet** sets CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, Referrer-Policy.
  The CSP allows what the app uses (Google Fonts, Unsplash images, 3D blob workers); widen it
  in `server.js` if you add new external sources.
- Secrets live only in env (`.env` is gitignored; `.env.example` / `.env.production.example`
  are templates).
- Request bodies capped at `10kb`; all SQL is parameterized; passwords are bcrypt-hashed;
  the server fails fast on missing required env vars.
- Errors: full detail logged server-side, generic `500` to clients in production.

## Pre-launch checklist

- [ ] `JWT_SECRET` is a fresh, long random value (not the dev one)
- [ ] DB credentials point at the managed MySQL, `DB_SOCKET` unset
- [ ] `NODE_ENV=production`
- [ ] `npm run build` succeeds and `/dist` is served (visit `/` → app loads)
- [ ] `/api/workshops` returns data over HTTPS
- [ ] Response headers include CSP + HSTS (check `curl -I https://your-domain`)
- [ ] No secrets committed (`git log -p | grep -i secret` clean)
