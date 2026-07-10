import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import { connectDB } from './db.js'
import projectRoutes from './routes/projects.js'
import adminLoginRoute from './routes/adminLogin.js'
import siteSettingsRoute from './routes/siteSettings.js'
import contactRoute from './routes/contact.js'

const app = express()
const PORT = process.env.API_PORT || 3001

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/admin', adminLoginRoute)
app.use('/api/projects', projectRoutes)
app.use('/api/site-settings', siteSettingsRoute)
app.use('/api/contact', contactRoute)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Global error handler ──────────────────────────────────────────────────────
// Normalises Multer and other route errors to consistent JSON responses.
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large.' })
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field.' })
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message })
  }
  console.error('[Server] Unhandled error:', err)
  const status = err.status || err.statusCode || 500
  res.status(status).json({ error: err.message || 'Internal server error.' })
})

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] API running on http://0.0.0.0:${PORT}`)
    })
  })
  .catch(err => {
    console.error('[Server] Failed to start:', err)
    process.exit(1)
  })
