# Deploying Nivora Interiors to Netlify

Everything — frontend and backend — runs on a single Netlify site.

| Layer | Technology | How it runs on Netlify |
|-------|-----------|------------------------|
| Frontend | React + Vite | Static build in `dist/` |
| Backend | Express API | Netlify Function (`netlify/functions/api.js`) |

The `/api/*` requests are transparently rewritten to the function by `netlify.toml`, so the browser always talks to the same origin — no CORS configuration needed.

---

## Step 1 — Push the repo to GitHub

If you haven't already:

```bash
git add .
git commit -m "Netlify deployment setup"
git push
```

---

## Step 2 — Create a new site on Netlify

1. Go to [netlify.com](https://netlify.com) and log in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and select the `nivora-interiors` repository.
4. Netlify reads `netlify.toml` automatically — the build settings are pre-filled:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

   Do **not** change these.

5. Click **Deploy site** — the first deploy will fail because the environment variables aren't set yet. That's fine.

---

## Step 3 — Add environment variables

1. In your Netlify site, go to **Site configuration → Environment variables**.
2. Click **Add a variable** and add each key listed in `.env.example` at the root of this repo, using your actual credential values.

The keys you need to set are:

```
NODE_ENV
MONGODB_URI
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD
SESSION_SECRET
EMAIL_USER
EMAIL_APP_SECRET
EMAIL_TO
```

> Find the actual values in your Replit Secrets panel or in `ecosystem.config.cjs` (which is on your private server, not committed with real values).

---

## Step 4 — Trigger a redeploy

1. Go to **Deploys** in your Netlify site.
2. Click **Trigger deploy → Deploy site**.
3. Wait for the build to finish (usually 1–2 minutes).

---

## Step 5 — Verify

Once deployed, open your Netlify URL and check:

| Test | How |
|------|-----|
| Site loads | Visit `https://your-site.netlify.app` |
| Projects load | Visit `/portfolio` — projects should appear |
| API health | Visit `https://your-site.netlify.app/api/health` — should return `{"status":"ok"}` |
| Contact form | Fill in and submit the enquiry form on `/contact` |
| Admin panel | Visit `/admin`, log in with your `ADMIN_USERNAME` / `ADMIN_PASSWORD` |

---

## Step 6 — (Optional) Custom domain

1. **Netlify → Domain management → Add custom domain**.
2. Follow the DNS instructions Netlify provides.
3. Netlify provisions a free SSL certificate automatically.

---

## How the architecture works

```
Browser
  │
  ├─ GET /portfolio          → Netlify CDN serves dist/index.html (React Router)
  │
  ├─ GET /api/projects       → netlify.toml rewrites to /.netlify/functions/api/projects
  │                            └─ Express route → MongoDB → JSON response
  │
  └─ POST /api/contact       → netlify.toml rewrites to /.netlify/functions/api/contact
                               └─ Express route → Nodemailer → Gmail
```

The rewrite is **transparent** (HTTP 200, not 301/302), so the browser always sees
requests going to the same origin. No CORS headers needed.

---

## Local development (unchanged)

```bash
# Terminal 1 — Express API on :3001
npm run server

# Terminal 2 — Vite dev server on :5000 (proxies /api → :3001)
npm run dev
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Build fails with `Cannot find module` | Ensure `serverless-http` is in `dependencies` (not `devDependencies`) in `package.json` |
| `/api/health` returns 404 | Check `netlify.toml` `[[redirects]]` — the `/api/*` rule must come before `/*` |
| Function times out | Netlify Function timeout is set to 26 s in `netlify.toml`. Cloudinary uploads on slow connections may still occasionally hit this. |
| Admin token rejected after redeploy | The token is in-memory and resets on every cold start. Just log in to `/admin` again. |
| MongoDB connection error | Confirm `MONGODB_URI` is set correctly in Netlify env vars and the Atlas cluster allows connections from any IP (`0.0.0.0/0`). |
