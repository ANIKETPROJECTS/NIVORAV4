import { Router } from 'express'
import * as XLSX from 'xlsx'
import { Enquiry } from '../models/Enquiry.js'
import { validateToken } from '../adminAuth.js'

const router = Router()

// ── Admin guard — reuses the same session token as the main admin panel,
//    since the records dashboard uses the same login credentials. ──────────────
function requireAdmin(req, res, next) {
  const provided = req.headers['x-admin-token']
  if (!validateToken(provided)) {
    return res.status(403).json({ error: 'Forbidden: invalid or missing admin token.' })
  }
  next()
}

const COLUMNS = [
  ['fullName', 'Full Name'],
  ['phone', 'Phone Number'],
  ['email', 'Email Address'],
  ['spaceType', 'Type of Space'],
  ['location', 'Project Location'],
  ['projectType', 'Project Type'],
  ['budget', 'Estimated Budget'],
  ['referral', 'How Did You Hear About Us'],
  ['requirements', 'Brief Requirements'],
  ['notes', 'Notes'],
  ['emailSent', 'Email Sent'],
  ['createdAt', 'Submitted At'],
]

// ── IMPORTANT: static routes MUST come before /:id to avoid shadowing ─────────

// ── GET /api/enquiries/export (static — must be before /:id) ──────────────────
router.get('/export', requireAdmin, async (_req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean()
    const rows = enquiries.map(e => {
      const row = {}
      for (const [key, label] of COLUMNS) {
        if (key === 'createdAt') row[label] = e.createdAt ? new Date(e.createdAt).toLocaleString() : ''
        else if (key === 'emailSent') row[label] = e.emailSent ? 'Yes' : 'No'
        else row[label] = e[key] ?? ''
      }
      return row
    })
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: COLUMNS.map(([, label]) => label) })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries')
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="nivora-enquiries-${Date.now()}.xlsx"`)
    res.send(buffer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to export enquiries' })
  }
})

// ── GET /api/enquiries ──────────────────────────────────────────────────────
router.get('/', requireAdmin, async (_req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 })
    res.json(enquiries)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
})

// ── PUT /api/enquiries/:id ──────────────────────────────────────────────────
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const allowed = ['fullName', 'phone', 'email', 'spaceType', 'location', 'projectType', 'budget', 'referral', 'requirements', 'notes']
    const update = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key]
    }
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { $set: update }, { returnDocument: 'after', runValidators: true })
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
    res.json(enquiry)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

// ── DELETE /api/enquiries/:id ─────────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id)
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete enquiry' })
  }
})

export default router
