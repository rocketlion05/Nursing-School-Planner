# Deployment & Auth Setup

This covers (1) fixing the live database connection — the cause of the `/programs`
500 and "can't save profile" errors — and (2) enabling Google + Microsoft sign-in.

Commands below are **Windows PowerShell**. `dotenv` does not override variables you
set in the shell, so the session vars you `$env:` below take priors over `.env`.

---

## 1. Provision the production database (Turso)

The live site fails with `ConnectionFailed` because it has no reachable database.
A serverless database (Turso libSQL) is required — a local `file:` SQLite path
cannot work on Vercel.

### 1a. Create the database
1. Sign up (free) at <https://turso.tech> and open the dashboard at
   <https://app.turso.tech>.
2. **Create Database** → pick a name (e.g. `nursing-school-planner`) and a region
   close to your users.
3. Copy the **Database URL** — it looks like `libsql://nursing-school-planner-<org>.turso.io`.
4. **Generate a database token** (dashboard: "Create Token", or CLI
   `turso db tokens create nursing-school-planner`). Copy the long token string.

### 1b. Apply the schema + seed data to it
From the project folder, in PowerShell:

```powershell
$env:DATABASE_URL = "libsql://YOUR-DB.turso.io"
$env:DATABASE_AUTH_TOKEN = "YOUR-TURSO-TOKEN"

npx tsx scripts/deploy-db.ts   # creates all tables (User, Profile, Program, ...)
npx tsx prisma/seed.ts         # loads the 20 programs + access codes
```

`deploy-db.ts` applies the Prisma migration SQL directly (Prisma's migrate engine
can't talk to a remote `libsql://` DB). Run it against a **fresh** database.

### 1c. Set the Vercel environment variables
Vercel → your project → **Settings → Environment Variables**. Add for the
**Production** environment (and Preview if you want previews to work):

| Name | Value |
|------|-------|
| `DATABASE_URL` | `libsql://YOUR-DB.turso.io` |
| `DATABASE_AUTH_TOKEN` | your Turso token |
| `AUTH_SECRET` | generate one (below) |
| `OAUTH_REDIRECT_BASE_URL` | `https://www.nursingschoolplanner.com` |

Generate `AUTH_SECRET` (Windows-friendly, no openssl needed):

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 1d. Redeploy & verify
Trigger a redeploy (push to `main`, or Vercel → Deployments → Redeploy). Then check:
- `https://www.nursingschoolplanner.com/programs` returns 200 with 20 programs.
- Signing up + saving a profile works on the live site.

---

## 2. Google sign-in

1. <https://console.cloud.google.com> → create (or pick) a project.
2. **APIs & Services → OAuth consent screen** → External → fill app name, your
   support email, developer email. (While in "Testing", add your own Google
   account under *Test users*.)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** →
   Application type **Web application**.
4. Under **Authorized redirect URIs**, add **both**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://www.nursingschoolplanner.com/api/auth/callback/google`
5. Create → copy **Client ID** and **Client secret**.
6. Set env vars (Vercel for prod, `.env` locally):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 3. Microsoft sign-in

1. <https://portal.azure.com> → **Microsoft Entra ID → App registrations → New
   registration**.
2. Name it; for **Supported account types** choose *Accounts in any organizational
   directory and personal Microsoft accounts* (matches the `common` tenant the app
   uses).
3. **Redirect URI**: platform **Web** → `https://www.nursingschoolplanner.com/api/auth/callback/microsoft`.
   After creating, go to **Authentication** and also add
   `http://localhost:3000/api/auth/callback/microsoft`.
4. Copy the **Application (client) ID**.
5. **Certificates & secrets → New client secret** → copy the secret **Value**
   (not the Secret ID).
6. Set env vars:
   - `MICROSOFT_CLIENT_ID` = Application (client) ID
   - `MICROSOFT_CLIENT_SECRET` = the secret Value

---

## 4. Local `.env`

`AUTH_SECRET` and `OAUTH_REDIRECT_BASE_URL=http://localhost:3000` are already in
your local `.env`. Uncomment and fill the `GOOGLE_*` / `MICROSOFT_*` lines to test
social login locally. The "Continue with Google/Microsoft" buttons stay disabled
until both the client ID and secret for that provider are set.
