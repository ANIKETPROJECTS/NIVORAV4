# Nivora Interiors

An interior design portfolio/showcase app with a React + Vite frontend and an Express API backend.

## Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router v6
- **Backend**: Express 5 (Node.js), Mongoose (MongoDB), Cloudinary (image storage), Multer (file upload)

## Running on Replit

Two workflows must both be running:

| Workflow | Command | Port |
|---|---|---|
| Start application | `npm run dev` | 5000 |
| Start API server | `npm run server` | 3001 |

The Vite dev server proxies `/api/*` requests to the Express API on port 3001.

## Required secrets

All set as Replit Secrets (not plaintext env vars):

| Secret | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_USERNAME` | Username for the admin panel |
| `ADMIN_PASSWORD` | Password for the admin panel |
| `SESSION_SECRET` | Session signing secret |
| `EMAIL_USER` | Gmail address used to send contact-form enquiries |
| `EMAIL_APP_SECRET` | Gmail app password |
| `EMAIL_TO` | Inbox that receives contact-form enquiries |

Note: `ecosystem.config.cjs` (used for standalone VPS/PM2 deploys outside Replit) intentionally keeps its own copy of these values in plaintext per the project owner's request — that file is unrelated to the Replit Secrets above and is not used when running on Replit.

## Contact form records ("excelsheet")

Every contact-form submission is saved to MongoDB in addition to being emailed — so a submission is never lost even if email delivery fails.

- Visit `/excelsheet` and log in with the same `ADMIN_USERNAME` / `ADMIN_PASSWORD` credentials as the main admin panel (`/adminpannel`). It's a separate login session, so signing out of one doesn't affect the other.
- `/excelsheet/data` shows all submitted enquiries: view, edit, delete, and download the full list as an `.xlsx` file.
- Backend: `server/models/Enquiry.js`, `server/routes/enquiries.js` (guarded by the same admin session token as `server/routes/projects.js`).
- Frontend: `src/pages/excel/`.

## Seeding data

```bash
npm run seed
```

## Project structure

```
src/           React frontend (pages, components, hooks)
server/        Express API (routes, models, db connection)
public/        Static assets
attached_assets/  Local image assets referenced by the frontend
```
