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

1. Push this repo to GitHub.
2. Add secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (from Site Tools → FTP).
3. Adjust `server-dir` in `.github/workflows/deploy-siteground.yml` if your web root is not `public_html`.
4. The workflow runs `npm ci`, `npm run build`, then uploads `dist/` via FTP.

**Apply API:** the static site does not run Node. Host `server/index.ts` separately (e.g. Render, Railway, Fly.io, or a small VPS) and set production `PUBLIC_APPLY_URL` in the **build** environment so the wizard posts to your live API.

## Project structure

- `src/pages/` — routes (marketing, blog, apply, RSS, 404)
- `src/content/blog/` — blog posts (Markdown)
- `src/lib/schema.ts` — Zod application schema (shared with API)
- `src/lib/quote-rules.ts` — indicative quote rules (tune here)
- `server/index.ts` — `POST /apply`, Resend, optional `GHL_WEBHOOK_URL`

## Legal

Privacy/Terms pages are **placeholders**. Have counsel review before collecting real data.

Indicative quotes are **not binding**; copy and UI reinforce this throughout.

### GitHub Actions secrets

Add these repository secrets for the deploy workflow:

- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` — SiteGround FTP/SFTP credentials
- `PUBLIC_APPLY_URL` — full URL of your hosted apply API (e.g. `https://api.example.com/apply`), **required at build time** so the wizard embeds the correct endpoint
- `PUBLIC_SITE_URL` (optional) — canonical site URL if it differs from `astro.config.mjs` `site`
