// Shared Express app — imported by both server/index.js (local dev)
// and netlify/functions/api.js (Netlify serverless).
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import projectRoutes from './routes/projects.js'
import adminLoginRoute from './routes/adminLogin.js'
import siteSettingsRoute from './routes/siteSettings.js'
import contactRoute from './routes/contact.js'

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
// When running on Netlify the function and the frontend share the same origin,
// so CORS is not needed in production.  We keep it permissive for local dev.
app.use(cors())

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/admin',         adminLoginRoute)
app.use('/api/projects',      projectRoutes)
app.use('/api/site-settings', siteSettingsRoute)
app.use('/api/contact',       contactRoute)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Debug endpoint — confirms the function is alive and which env vars are present.
// Does NOT require MongoDB. Visit /api/debug in the browser to diagnose 502s.
app.get('/api/debug', (_req, res) => {
  const vars = [
    'MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD',
    'SESSION_SECRET', 'EMAIL_USER', 'EMAIL_APP_SECRET', 'EMAIL_TO', 'NODE_ENV',
  ]
  res.json({
    status: 'function alive',
    env: Object.fromEntries(vars.map(k => [k, !!process.env[k]])),
  })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE')      return res.status(413).json({ error: 'File too large.' })
  if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Unexpected file field.' })
  if (err.name === 'MulterError')           return res.status(400).json({ error: err.message })
  console.error('[Server] Unhandled error:', err)
  res.status(err.status || err.statusCode || 500).json({ error: err.message || 'Internal server error.' })
})

export default app
