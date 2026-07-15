# Deploying BECO Bearings to Vercel

The whole app (React frontend **and** the API) deploys to Vercel as one
project. You'll connect two Vercel storage add-ons: a **Postgres** database
(Neon) and a **Blob** store (for product photos). Both have free tiers.

Total time: ~15 minutes. You need a GitHub account and a Vercel account
(sign in to Vercel with GitHub — easiest).

---

## Step 1 — Put the code on GitHub

If you haven't already:

1. Create a new **empty** repo at https://github.com/new (e.g. `beco-bearings`).
   Don't add a README/.gitignore — the project already has them.
2. In a terminal in the project folder:

   ```bash
   git remote add origin https://github.com/<your-username>/beco-bearings.git
   git push -u origin main
   ```

   (If git asks you to sign in, a browser window opens — approve it.)

---

## Step 2 — Import the project into Vercel

1. Go to https://vercel.com/new and pick your `beco-bearings` repo.
2. Vercel reads `vercel.json` automatically. Leave the build settings as
   detected (Build Command and Output Directory come from `vercel.json`).
3. **Don't click Deploy yet** — add the database and blob store first
   (Step 3 & 4), otherwise the first deploy has nowhere to store data.
   (If you already deployed, that's fine — just redeploy after Step 5.)

---

## Step 3 — Add a Postgres database (Neon)

1. In your Vercel project → **Storage** tab → **Create Database** →
   **Neon** (Serverless Postgres) → follow the prompts (free plan).
2. When it asks to connect it to the project, say **yes**. Vercel injects the
   connection string as environment variables automatically, including
   `DATABASE_URL`.
   - If your integration only creates `POSTGRES_URL` (not `DATABASE_URL`),
     the app reads either one — no action needed.
3. The database tables and the product catalogue seed themselves automatically
   on the first request. No migration step required.

---

## Step 4 — Add Blob storage (for product photos)

1. Same **Storage** tab → **Create Database** → **Blob** → create it and
   connect it to the project.
2. This injects `BLOB_READ_WRITE_TOKEN` automatically. That's all the photo
   upload feature needs.

---

## Step 5 — Set the remaining environment variables

Project → **Settings → Environment Variables**. Add these for
**Production** (and Preview if you want):

| Name | Value | Notes |
|------|-------|-------|
| `JWT_SECRET` | a long random string | e.g. run `openssl rand -base64 32` |
| `ADMIN_EMAIL` | your admin email | the admin login |
| `ADMIN_PASSWORD` | a strong password | **change this from the default!** |

`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` were added for you in Steps 3–4.

> The admin account is created on the first request using these values. If you
> change `ADMIN_EMAIL`/`ADMIN_PASSWORD` *after* the first deploy, the old admin
> row already exists — either use the original values, or delete the `users`
> row in the Neon dashboard and redeploy.

---

## Step 6 — Deploy

Click **Deploy** (or **Redeploy** if you deployed earlier so the new env vars
take effect). When it finishes you get a URL like
`https://beco-bearings.vercel.app` — that's the link to share with your client.

**Check it works:**
- Open the URL → catalogue loads with 33 bearings.
- Sign up a test customer, add to cart, go through checkout to the payment step.
- Log in as admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) → the **ADMIN** link
  appears → edit a price/stock, upload a photo.

---

## How it's wired (for reference)

- `vercel.json` builds the Vite client into `client/dist` (served as static
  files) and routes every `/api/*` request to the serverless function in
  `api/index.js`, which runs the Express app from `server/src/app.js`.
- Frontend and API share the same domain, so there are **no CORS or API-URL
  settings** to configure.
- Database: `pg` against Neon in production; an in-process PGlite database
  locally (so `npm run dev:server` needs no setup).
- Photos: Vercel Blob in production; local `server/uploads/` in dev.

## Custom domain (optional)

Project → **Settings → Domains** → add your domain (e.g. `becobearings.com`)
and follow the DNS instructions. The `.vercel.app` URL keeps working too.

## Payment gateway

Still intentionally not wired — see [`server/PAYMENTS.md`](server/PAYMENTS.md)
for the Stripe steps when you're ready.
