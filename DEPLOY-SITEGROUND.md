# Deploy to SiteGround (Plan A) — step by step

This matches [`.github/workflows/deploy-siteground.yml`](.github/workflows/deploy-siteground.yml): GitHub builds the site and uploads the **`dist/`** folder to your hosting over **FTP**.

---

## Step 1 — Open the right place in SiteGround

1. Log in to [SiteGround](https://www.siteground.com/).
2. Go to **Websites** (or **Services**) and open **Site Tools** for the site you want to deploy to.

You need access to **FTP** credentials for that site.

---

## Step 2 — Get your FTP connection details

1. In **Site Tools**, use the search box and type **FTP**, or open:

   **Site** → **FTP Accounts**  
   (wording can vary slightly; look for **FTP** or **FTP Accounts**.)

2. You should see:

   - **FTP hostname** (sometimes labeled *Server*, *Host*, or *FTP server*)  
     Example shape: `ftp.yourdomain.com` or a long hostname SiteGround shows.
   - **Port** — often **21** for classic FTP; SiteGround also shows this next to the hostname in many panels.
   - **FTP username** (often looks like `u123456789`, or an email such as `you@yourdomain.com`).
   - **Password** — if you do not know it, use **Create FTP Account** or **Reset password** for an account that can write to your site files.

3. **Home path shows `/` — what that means**

   - **`/`** is normal. It means “the root of what this FTP user is allowed to see,” not the whole server.
   - After you connect (FileZilla, etc.), you usually see folders such as **`public_html`**, **`logs`**, maybe others. The **live website** for the main domain is almost always inside **`public_html`**.
   - Our workflow uploads into **`./public_html/`** on the server. That matches the usual layout when your account root contains a `public_html` folder.
   - **If** your FTP user already opens *inside* `public_html` (you do not see a `public_html` folder—only site files), change the workflow’s `server-dir` from `./public_html/` to `./` and commit.

4. **Important:** Use an account that can write to the folder that serves your website (normally via `public_html` for the primary domain).

5. Write down (in a password manager or temporary note):

   | Field | Your value |
   |------|------------|
   | Hostname | `___________________________` |
   | Port | `___________________________` (often `21`) |
   | Username | `___________________________` |
   | Password | `___________________________` |

---

## Step 3 — Confirm the folder on the server (usually `public_html`)

- For the **primary domain**, files for `https://yoursite.com` usually live in **`public_html`**.
- The workflow uses `server-dir: ./public_html/` by default.  
  If SiteGround shows a different web root for your domain, change `server-dir` in the workflow file to match (e.g. `./www/` — only if your panel says so).

---

## Step 4 — Add secrets in GitHub (exact names)

1. Open your repo on GitHub, e.g. `https://github.com/agveresan/solvantapay`.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** for each row below.

Use these **names exactly** (GitHub secret names are case-sensitive):

| Secret name | What to paste |
|-------------|----------------|
| `FTP_SERVER` | The **FTP hostname only** — **not** a URL. No `ftp://`, no `https://`, no path, no spaces. Example: `ftp.solvantapay.com` (copy the host line from Site Tools exactly; if deploy fails with `ENOTFOUND`, this value is almost always wrong). |
| `FTP_PORT` | The **port number** SiteGround gives you (digits only). Often **`21`** for FTP. |
| `FTP_USERNAME` | The **FTP username** from Step 2. |
| `FTP_PASSWORD` | The **FTP password** from Step 2. |

**Build-time URLs (recommended for a real launch):**

| Secret name | What to paste |
|-------------|----------------|
| `PUBLIC_APPLY_URL` | Full URL of your **live** apply API, e.g. `https://your-api-host.com/apply`. This is baked into the site at build time. If you do not have an API URL yet, you can skip this secret for now; the Apply form will show a “missing URL” message until you set it and rebuild. |
| `PUBLIC_SITE_URL` | Optional. Your live site origin, e.g. `https://www.yourdomain.com` — use if it should differ from `site` in `astro.config.mjs`. |

4. After each secret, click **Add secret** (or **Update**).

---

## Step 5 — Run the deployment workflow

**Option A — Push to `main` (automatic)**

```bash
git add .
git commit -m "Trigger deploy"
git push origin main
```

**Option B — Run manually**

1. Repo → **Actions** → workflow **Deploy static site to SiteGround**.
2. **Run workflow** → branch **main** → **Run workflow**.

---

## Step 6 — Watch the run

1. **Actions** → open the latest workflow run.
2. Wait for **Build** and **Upload dist via FTP** to finish green.
3. If something fails, open the failed step and read the log (connection refused, login failed, path not found, etc.).

---

## Step 7 — Check your live site

Open your domain in a browser. You may need to wait a minute or hard-refresh (**Ctrl+F5**) to bypass cache.

---

## Troubleshooting

| Problem | What to try |
|--------|--------------|
| **`getaddrinfo ENOTFOUND`** | DNS cannot resolve your FTP host. Almost always **`FTP_SERVER` is wrong**. Fix: open the **`FTP_SERVER`** secret and set it to the **hostname only** — no `ftp://`, no `https://`, no path, no trailing slash, no spaces. Example: `ftp.solvantapay.com` or whatever Site Tools shows next to **FTP hostname**. Do **not** paste the full URL from a browser. Re-save the secret and re-run the workflow. |
| **Login / authentication failed** | Re-copy username and password; reset FTP password in Site Tools; ensure no extra spaces in secrets. |
| **Could not connect / timeout** | Confirm `FTP_SERVER` is the hostname from Site Tools (not your domain registrar). Check SiteGround status; try from another network to rule out local firewall. |
| **Node.js 20 deprecation warning** | The workflow sets `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` so Actions uses Node 24 for JavaScript-based actions. You can ignore residual notices until action authors ship Node 24 builds. |
| **Files uploaded but site unchanged** | Wrong `server-dir` or wrong FTP account (subdomain folder). Confirm in Site Tools which folder that domain uses. |
| **FTPS vs FTP** | SiteGround often supports both. If plain FTP fails, we can switch the workflow to **FTPS** (this action supports `ftp` / `ftps` / `ftps-legacy`). |
| **Port is 22 (SFTP)** | Port **22** is usually **SFTP** (SSH), not FTP. The [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) does **not** support SFTP. Use **`FTP_PORT` = `21`** with normal FTP, or ask us to switch the workflow to an SFTP-based upload. |
| **Apply form does not work on production** | You must host `server/index.ts` separately and set `PUBLIC_APPLY_URL` to that live `/apply` URL, then redeploy. |

---

## What this does *not* use

- The **SSH deploy key** you added on GitHub for SiteGround **Git clone** is **not** used by this FTP workflow. Plan A only needs the **FTP secrets** above.

If you want, we can later add a second workflow that uses **SFTP + SSH key** instead of FTP password.
