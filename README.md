# Solvanta Pay — marketing site

Static Astro site for **Solvanta Pay** (high-risk merchant payment processing): MDX-ready content layer, SEO metadata, RSS, multi-step **Apply** wizard, and a small **Express** API for server-side quotes + Resend email.

## Prerequisites

- Node.js **22+** (see `engines` in `package.json`)

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

- `PUBLIC_APPLY_URL` — URL of the apply API. For local dev: `http://localhost:3001/apply`
- `PUBLIC_SITE_URL` — optional override for canonical URLs (defaults to `site` in `astro.config.mjs`)
- For the API server: `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO`, `ALLOWED_ORIGINS`

## Develop

Terminal 1 — Astro (site):

```bash
npm run dev
```

Terminal 2 — Apply API (quotes + email):

```bash
npm run api
```

Ensure `PUBLIC_APPLY_URL` in `.env` matches the API (e.g. `http://localhost:3001/apply`).

## Build

```bash
npm run build
```

Output: `dist/` — deploy this folder to SiteGround (or any static host).

## Deploy (GitHub → SiteGround)

**Step-by-step checklist:** see **[DEPLOY-SITEGROUND.md](./DEPLOY-SITEGROUND.md)** (FTP secrets in GitHub, then push to `main` or run the workflow manually).

Summary:

1. In Site Tools, get **FTP hostname**, **username**, and **password** (see the guide).
2. In the GitHub repo: **Settings → Secrets and variables → Actions**, add `FTP_SERVER`, `FTP_PORT`, `FTP_USERNAME`, `FTP_PASSWORD` (and optionally `PUBLIC_APPLY_URL`, `PUBLIC_SITE_URL`).
3. Push to **`main`** or use **Actions → Deploy static site to SiteGround → Run workflow**.
4. Remote path defaults to **`solvantapay.com/public_html/`** on the server (SiteGround). Override with repo variable **`FTP_SERVER_DIR`** if your layout differs (see [DEPLOY-SITEGROUND.md](./DEPLOY-SITEGROUND.md)).

**Apply API:** the static site does not run Node. Host `server/index.ts` separately (e.g. Render, Railway, Fly.io, or a small VPS) and set production `PUBLIC_APPLY_URL` as a **secret** so the build embeds the correct endpoint.

## Project structure

- `src/pages/` — routes (marketing, blog, apply, RSS, 404)
- `src/content/blog/` — blog posts (Markdown)
- `src/lib/schema.ts` — Zod application schema (shared with API)
- `src/lib/quote-rules.ts` — indicative quote rules (tune here)
- `server/index.ts` — `POST /apply`, Resend, optional `GHL_WEBHOOK_URL`

## Legal

Privacy/Terms pages are **placeholders**. Have counsel review before collecting real data.

Indicative quotes are **not binding**; copy and UI reinforce this throughout.

### GitHub Actions secrets (details)

See **[DEPLOY-SITEGROUND.md](./DEPLOY-SITEGROUND.md)** for screenshots-style instructions and troubleshooting.
