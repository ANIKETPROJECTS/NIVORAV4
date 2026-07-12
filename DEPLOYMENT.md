# Deploying Nivora Interiors to Netlify

The project is split into two parts that deploy separately:

| Part | What it is | Where it goes |
|------|-----------|---------------|
| **Frontend** | React + Vite (static build) | Netlify |
| **Backend** | Express API + MongoDB | Render (free tier) or any Node.js host |

Netlify proxies all `/api/*` requests from the frontend to the backend automatically — the React app never needs to know the backend URL.

---

## Step 1 — Deploy the Express backend on Render

1. Go to [render.com](https://render.com) and sign up / log in.
2. Click **New → Web Service** and connect your GitHub repo.
3. Configure the service:
   - **Runtime**: Node
   - **Build command**: `npm install`
   - **Start command**: `node server/index.js`
   - **Instance type**: Free
4. Under **Environment**, add every variable from `.env.example`:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `API_PORT` | `3001` |
   | `MONGODB_URI` | *(from .env.example)* |
   | `CLOUDINARY_CLOUD_NAME` | `tgmyheme` |
   | `CLOUDINARY_API_KEY` | `811595815326532` |
   | `CLOUDINARY_API_SECRET` | *(from .env.example)* |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | `admin123` |
   | `SESSION_SECRET` | *(from .env.example)* |
   | `EMAIL_USER` | `nivora.inbox@gmail.com` |
   | `EMAIL_APP_SECRET` | *(from .env.example)* |
   | `EMAIL_TO` | `nivora.inbox@gmail.com` |
   | `FRONTEND_URL` | *(your Netlify URL — add after Step 2)* |

5. Click **Deploy**. Once green, copy the service URL, e.g.:
   ```
   https://nivora-api.onrender.com
   ```

---

## Step 2 — Deploy the frontend on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up / log in.
2. Click **Add new site → Import an existing project** and connect your GitHub repo.
3. Netlify auto-detects the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Under **Site configuration → Environment variables**, add:

   | Key | Value |
   |-----|-------|
   | `BACKEND_URL` | `https://nivora-api.onrender.com` *(your Render URL from Step 1, no trailing slash)* |

5. Click **Deploy site**. Netlify builds and publishes the frontend.
6. Copy your Netlify site URL, e.g. `https://nivora-interiors.netlify.app`.

---

## Step 3 — Wire the CORS back-reference

Once you have the Netlify URL:

1. Go back to Render → your service → **Environment**.
2. Update `FRONTEND_URL` to your Netlify URL:
   ```
   https://nivora-interiors.netlify.app
   ```
3. Render redeploys automatically. CORS will now only accept requests from your frontend.

---

## Step 4 — (Optional) Custom domain on Netlify

1. **Netlify → Domain management → Add custom domain**.
2. Point your DNS CNAME to Netlify's load balancer as instructed.
3. Update `FRONTEND_URL` on Render to match the custom domain.

---

## How the proxy works

```
Browser  →  GET /api/projects
         →  Netlify edge (netlify.toml redirect, status 200)
         →  https://nivora-api.onrender.com/api/projects
         →  Express → MongoDB → response
         →  Browser
```

The `[[redirects]]` block in `netlify.toml` does the forwarding:

```toml
[[redirects]]
  from   = "/api/*"
  to     = "${BACKEND_URL}/api/:splat"
  status = 200
  force  = true
```

`${BACKEND_URL}` is substituted with the environment variable you set in Step 2.

---

## Local development (unchanged)

```bash
# Terminal 1 — API server
npm run server

# Terminal 2 — Vite dev server (proxies /api → localhost:3001)
npm run dev
```

No `.env` changes needed locally — the Replit Secrets supply all environment variables.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Netlify build fails | Check Node version is 20 in `netlify.toml` `[build.environment]` |
| `/api/*` returns 404 on Netlify | Ensure `BACKEND_URL` env var is set in Netlify (no trailing slash) |
| API returns CORS error | Ensure `FRONTEND_URL` is set correctly on Render |
| Admin token rejected after Render redeploy | The token rotates on restart — log in to the admin panel again |
| Render free tier spins down after 15 min | First API call after idle takes ~30s to wake. Upgrade to paid or use an uptime monitor. |
