import { Router } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { Project } from '../models/Project.js'
import { validateToken } from '../adminAuth.js'

const router = Router()

// Multer – store upload in memory, then stream to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 30 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  },
})

// Helper: upload a buffer to Cloudinary and return the secure URL
function uploadToCloudinary(buffer, folder = 'nivora/projects') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    )
    stream.end(buffer)
  })
}

// ── Admin guard — validates the session token issued by /api/admin/login ──────
function requireAdmin(req, res, next) {
  const provided = req.headers['x-admin-token']
  if (!validateToken(provided)) {
    return res.status(403).json({ error: 'Forbidden: invalid or missing admin token.' })
  }
  next()
}

// ── IMPORTANT: static routes MUST come before /:id to avoid shadowing ─────────

// ── GET /api/projects ─────────────────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const projects = await Project.find(
      {},
      'id name location category year badge concept coverImage heroImage order'
    ).sort({ order: 1, createdAt: -1 })
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// ── PUT /api/projects/reorder (static — must be before /:id) ──────────────────
// Body: { order: [id1, id2, id3, ...] } — full list of project ids in desired order
router.put('/reorder', requireAdmin, async (req, res) => {
  try {
    const { order } = req.body || {}
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: 'order must be a non-empty array of project ids' })
    }
    const uniqueIds = new Set(order)
    if (uniqueIds.size !== order.length) {
      return res.status(400).json({ error: 'order contains duplicate ids' })
    }
    const existingCount = await Project.countDocuments({ id: { $in: order } })
    if (existingCount !== order.length) {
      return res.status(400).json({ error: 'order contains unknown project ids' })
    }
    const totalCount = await Project.countDocuments()
    if (order.length !== totalCount) {
      return res.status(400).json({ error: 'order must include every project' })
    }
    const bulkOps = order.map((id, index) => ({
      updateOne: { filter: { id }, update: { $set: { order: index } } },
    }))
    const result = await Project.bulkWrite(bulkOps, { ordered: true })
    if (result.matchedCount !== order.length) {
      return res.status(409).json({ error: 'Some projects could not be reordered' })
    }
    res.json({ message: 'Order updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// ── POST /api/projects/upload-image (static — must be before /:id) ────────────
router.post('/upload-image', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const url = await uploadToCloudinary(req.file.buffer)
    res.json({ url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Image upload failed' })
  }
})

// ── POST /api/projects/upload-images (static — must be before /:id) ──────────
router.post('/upload-images', requireAdmin, upload.array('images', 30), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' })
    // Upload in batches of 5 to avoid memory pressure
    const urls = []
    const batch = 5
    for (let i = 0; i < req.files.length; i += batch) {
      const chunk = req.files.slice(i, i + batch)
      const chunkUrls = await Promise.all(chunk.map(f => uploadToCloudinary(f.buffer)))
      urls.push(...chunkUrls)
    }
    res.json({ urls })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Image upload failed' })
  }
})

// ── POST /api/projects (create — must be before /:id) ────────────────────────
router.post('/', requireAdmin, async (req, res) => {
  try {
    const body = { ...req.body }
    if (body.order === undefined) {
      const count = await Project.countDocuments()
      body.order = count
    }
    const project = new Project(body)
    await project.save()
    res.status(201).json(project)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

// ── GET /api/projects/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// ── PUT /api/projects/:id ─────────────────────────────────────────────────────
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    )
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router
