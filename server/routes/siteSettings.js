import { Router } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { SiteSettings } from '../models/SiteSettings.js'
import { validateToken } from '../adminAuth.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'))
    cb(null, true)
  },
})

function uploadToCloudinary(buffer, folder = 'nivora/site') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    )
    stream.end(buffer)
  })
}

function requireAdmin(req, res, next) {
  if (!validateToken(req.headers['x-admin-token'])) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

async function getSettings() {
  let doc = await SiteSettings.findOne({ _singleton: 'default' })
  if (!doc) doc = await SiteSettings.create({ _singleton: 'default' })
  return doc
}

// ── GET /api/site-settings (public) ──────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const doc = await getSettings()
    // Convert to plain object so ALL fields are included.
    // Mongoose schema defaults (e.g. logoSize, footerLogoSize) are applied at
    // the JS layer but NOT stored in MongoDB until first explicit save, so
    // res.json(doc) omits them.  Calling toObject() + explicit defaults ensures
    // the client always receives every field.
    const plain = doc.toObject({ versionKey: false })
    if (plain.logoSize == null)       plain.logoSize       = 38
    if (plain.footerLogoSize == null) plain.footerLogoSize = 200
    res.json(plain)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch site settings' })
  }
})

// ── PUT /api/site-settings (admin — JSON fields only) ─────────────────────────
router.put('/', requireAdmin, async (req, res) => {
  try {
    const allowed = ['logoUrl', 'logoSize', 'footerLogoUrl', 'footerLogoSize', 'serviceCards', 'homePortfolio', 'homeHero', 'servicePageHero', 'servicesList', 'homeStats', 'aboutStats']
    const update = {}
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key]
    }
    const doc = await SiteSettings.findOneAndUpdate(
      { _singleton: 'default' },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    )
    // Use same toObject() pattern as GET so all fields are always serialized
    const plain = doc.toObject({ versionKey: false })
    if (plain.logoSize == null)       plain.logoSize       = 38
    if (plain.footerLogoSize == null) plain.footerLogoSize = 200
    res.json(plain)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

// ── POST /api/site-settings/upload-image (admin — single image upload) ────────
router.post('/upload-image', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' })
    const url = await uploadToCloudinary(req.file.buffer, 'nivora/site')
    res.json({ url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router
