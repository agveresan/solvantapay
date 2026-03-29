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
     **Use exactly what SiteGround lists** — often something like `c1234567.sgvps.net`, not your bare domain. SiteGround frequently uses **`*.sgvps.net`** hosts for FTP; that hostname is what belongs in the `FTP_SERVER` secret. Do **not** substitute `yoursite.com` unless Site Tools explicitly shows that as the FTP server and you have verified it works in an FTP client.
   - **Port** — often **21** for classic FTP; SiteGround also shows this next to the hostname in many panels.
   - **FTP username** (often looks like `u123456789`, or an email such as `you@yourdomain.com`).
   - **Password** — if you do not know it, use **Create FTP Account** or **Reset password** for an account that can write to your site files.

3. **Home path shows `/` — what that means**

   - **`/`** is normal. It means “the root of what this FTP user is allowed to see,” not the whole server.
   - After you connect (FileZilla, etc.), you may see **`public_html`** at the account root **and** a folder named after your domain (e.g. **`solvantapay.com`**) with **another** `public_html` inside it.
   - On many SiteGround setups, the **live site** for `https://solvantapay.com` is served from **`solvantapay.com/public_html/`**, not the top-level `public_html`. Check where your existing `Default.html` or site files live and point deploy there.
   - The workflow defaults to **`./solvantapay.com/public_html/`**. To use a different path, set a repository **variable** `FTP_SERVER_DIR` (Settings → Secrets and variables → **Variables** → Actions), e.g. `./public_html/` or `./otherdomain.com/public_html/`.
   - **If** your FTP user opens *inside* the real web root already, set `FTP_SERVER_DIR` to **`./`** (trailing slash style: `./` as in action docs).

4. **Important:** Use an account that can write to the folder that serves your website (normally via `public_html` for the primary domain).

5. Write down (in a password manager or temporary note):

   | Field | Your value |
   |------|------------|
   | Hostname | `___________________________` |
   | Port | `___________________________` (often `21`) |
   | Username | `___________________________` |
   | Password | `___________________________` |

---

## Step 3 — Confirm the folder on the server

- **SiteGround:** the web root is often **`yourdomain.com/public_html/`** (domain folder, then `public_html`), not always the account-root **`public_html`**.
- This repo’s workflow defaults to **`./solvantapay.com/public_html/`** so files land where the site is actually served.
- To override without editing YAML: GitHub → **Settings** → **Secrets and variables** → **Variables** → **Actions** → add **`FTP_SERVER_DIR`** = e.g. `./public_html/` or `./example.com/public_html/` (must end with `/` per the FTP action).

---

## Step 4 — Add secrets in GitHub (exact names)

1. Open your repo on GitHub, e.g. `https://github.com/agveresan/solvantapay`.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** for each row below.

Use these **names exactly** (GitHub secret names are case-sensitive):

| Secret name | What to paste |
|-------------|----------------|
| `FTP_SERVER` | The **FTP hostname only** — **not** a URL. No `ftp://`, no `https://`, no path, no spaces. **Paste the server host from Site Tools** (e.g. `c1107640.sgvps.net` or `ftp.yourdomain.com` — whichever SiteGround shows). Prefer that over your website domain alone: FTP often uses a **`*.sgvps.net`** host while `solvantapay.com` is only the site address. If deploy fails with `ENOTFOUND`, this value is almost always wrong. |
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
| **Files uploaded but site unchanged** | Wrong remote folder. In Site Tools / FTP, find where the live site files actually live (often **`domain.com/public_html/`**). Set variable **`FTP_SERVER_DIR`** or edit `server-dir` in the workflow. |
| **FTPS vs FTP** | SiteGround often supports both. If plain FTP fails, we can switch the workflow to **FTPS** (this action supports `ftp` / `ftps` / `ftps-legacy`). |
| **Port is 22 (SFTP)** | Port **22** is usually **SFTP** (SSH), not FTP. The [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) does **not** support SFTP. Use **`FTP_PORT` = `21`** with normal FTP, or ask us to switch the workflow to an SFTP-based upload. |
| **Apply form does not work on production** | You must host `server/index.ts` separately and set `PUBLIC_APPLY_URL` to that live `/apply` URL, then redeploy. |

---

## What this does *not* use

- The **SSH deploy key** you added on GitHub for SiteGround **Git clone** is **not** used by this FTP workflow. Plan A only needs the **FTP secrets** above.

If you want, we can later add a second workflow that uses **SFTP + SSH key** instead of FTP password.
