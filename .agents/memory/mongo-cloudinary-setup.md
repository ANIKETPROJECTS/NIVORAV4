---
name: MongoDB + Cloudinary setup
description: Architecture and gotchas for the Nivora portfolio backend integration
---

**Why:** Portfolio images were loading slowly from local/Google Drive; moved to MongoDB for data + Cloudinary for image hosting.

**Architecture:**
- Express API runs on port 3001 (`npm run server` / "Start API server" workflow)
- Vite dev server proxies `/api` → `http://localhost:3001`
- Frontend fetches from `/api/projects` and `/api/projects/:id` via `src/lib/api.ts`
- Mongoose model: `server/models/Project.js` — all portfolio fields stored (badge, name, location, category, year, conceptLabel, concept, description, designIntentLabel, designIntent, materials[], coverImage, images[])
- Upload endpoints: `POST /api/projects/upload-image` and `POST /api/projects/upload-images` — protected by `requireAdmin` middleware

**Critical gotcha — Mongoose v9 middleware:**
- Use `async function()` (no `next` param) in `pre('save')` and `pre('findOneAndUpdate')` hooks
- Passing `next` as a param causes "next is not a function" error in Mongoose v9
- Also: `delete mongoose.models.Project` before `mongoose.model(...)` to avoid stale cached model issues during dev

**Critical gotcha — Express route order:**
- Static routes (`/upload-image`, `/upload-images`, `POST /`) MUST be declared before `/:id` param routes
- Otherwise `/:id` swallows static paths

**Auth:**
- `ADMIN_USERNAME` + `ADMIN_PASSWORD` env vars are required — server exits on boot if either is missing
- Login endpoint validates them and issues a session token (rotates each server restart), sent back via `x-admin-token` header on mutating requests

**Seeding:**
- `npm run seed` → `server/seed.js` (upserts all projects)
- Currently only 1 project in DB ("serenity-villa-mumbai") with placeholder images — user will update images via Cloudinary later
