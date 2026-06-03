# 960121 Mini Project — แป้งละออง (Pang-La-Ong)

A **Smart-Niche Marketplace** for the *Skill-Share Workshop* niche — booking seats for
artisan baking classes. Full-stack: React + Vite frontend, Node.js + Express backend
(Controller-Route-Service), MySQL persistence, JWT + bcrypt auth.

> **Niche twist (capacity logic):** every class has a `max_capacity`. At checkout the
> server runs a transactional capacity check (`SELECT … FOR UPDATE`) and rejects an
> over-booking with **409 Conflict** — never trusting the client.

## Architecture

```
src/                       React + Vite frontend (@ → src/)
  components/ pages/ contexts/ api/   dynamic catalog, filters, booking, auth
backend/
  server.js                entry — env validation, middleware, routes
  config/db.js             MySQL connection pool (mysql2/promise)
  routes/ controllers/ services/   Controller-Route-Service (Separation of Concerns)
  middleware/              requireAuth (JWT) + global errorHandler
  schema.sql  seed.sql     relational schema (PK/FK/constraints) + sample data
```

## Database note (MySQL, not SQLite)

This project uses **MySQL** (server-based) rather than SQLite. The connection is fully
config-driven via `.env`, so switching databases is a config change, not a code change.
Because there is no `*.db` file, there is no database file to leak into Git — the
relevant "Storage Gatekeeper" concern is satisfied by design.

## Setup

### 1. Frontend

```bash
npm install
npm run dev      # http://localhost:5173 (proxies /api → http://localhost:3000)
npm run build    # production bundle
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env       # then fill in the values (see below)
```

Initialize the database in one step — `init-db` creates the database (if missing)
and loads `schema.sql` + `seed.sql` using the values from your `.env`:

```bash
npm run init-db
```

> Prefer to do it by hand? The equivalent manual steps are:
> ```bash
> mysql -u root -p -e "CREATE DATABASE panglaong_db CHARACTER SET utf8mb4;"
> mysql -u root -p panglaong_db < schema.sql
> mysql -u root -p panglaong_db < seed.sql
> ```

Start the API (must be running on port 3000 for the frontend to load data):

```bash
npm start          # node server.js → http://localhost:3000
# npm run dev      # auto-restart on changes (nodemon)
# npm run start:prod  # build the frontend and serve it from Express
```

### Required environment variables (`backend/.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `JWT_SECRET` | Signing secret for JWT (keep private) | `a-long-random-string` |
| `JWT_EXPIRES_IN` | Token lifetime | `24h` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASS` | MySQL password | `your-password` |
| `DB_NAME` | Database name | `panglaong_db` |
| `DB_HOST` / `DB_PORT` | TCP connection (Linux/prod) | `127.0.0.1` / `3306` |
| `DB_SOCKET` | Unix socket (macOS Homebrew MySQL) | `/tmp/mysql.sock` |
| `PORT` | API port | `3000` |

The server **fails fast on startup** with a clear message if any required variable is
missing — copy `.env.example` and fill it in before running.

## Go-Live notes

- Secrets live only in `backend/.env` (gitignored); `backend/.env.example` is the tracked
  template.
- Errors: full detail is logged server-side; clients get a generic `500` in production.
- Requests are capped at `10kb`; all SQL uses parameterized queries.
