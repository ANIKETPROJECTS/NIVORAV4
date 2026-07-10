import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

let transporter = null
function getTransporter() {
  if (transporter) return transporter
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_SECRET) return null
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_SECRET,
    },
  })
  return transporter
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Strips characters that could inject extra header lines (CRLF header injection).
function stripHeaderInjection(str) {
  return String(str ?? '').replace(/[\r\n]+/g, ' ').trim()
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-() ]{6,20}$/
const MAX_LEN = { short: 200, long: 4000 }

function clean(value, maxLen) {
  const s = stripHeaderInjection(value).slice(0, maxLen)
  return s
}

// POST /api/contact
// Body: enquiry form fields from the Contact page
router.post('/', async (req, res) => {
  const body = req.body || {}

  const fullName = clean(body.fullName, MAX_LEN.short)
  const phone = clean(body.phone, MAX_LEN.short)
  const email = clean(body.email, MAX_LEN.short)
  const spaceType = clean(body.spaceType, MAX_LEN.short)
  const location = clean(body.location, MAX_LEN.short)
  const projectType = clean(body.projectType, MAX_LEN.short)
  const budget = clean(body.budget, MAX_LEN.short)
  const referral = clean(body.referral, MAX_LEN.short)
  const requirements = clean(body.requirements, MAX_LEN.long)

  if (!fullName || !phone || !email || !spaceType) {
    return res.status(400).json({ error: 'Full name, phone, email, and type of space are required.' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' })
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'Please provide a valid phone number.' })
  }

  const t = getTransporter()
  if (!t) {
    console.error('[Contact] Email transporter not configured — missing EMAIL_USER or EMAIL_APP_SECRET.')
    return res.status(500).json({ error: 'Email is not configured on the server.' })
  }

  const to = process.env.EMAIL_TO || process.env.EMAIL_USER
  const fields = [
    ['Full Name', fullName],
    ['Phone Number', phone],
    ['Email Address', email],
    ['Type of Space', spaceType],
    ['Project Location', location],
    ['Project Type', projectType],
    ['Estimated Budget', budget],
    ['How Did You Hear About Us', referral],
    ['Brief Requirements', requirements],
  ]

  const html = `
    <h2 style="font-family:sans-serif;color:#2D3B2D;">New Enquiry — Nivora Interiors</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
      ${fields.map(([label, value]) => `
        <tr>
          <td style="padding:6px 12px;font-weight:600;color:#555;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 12px;color:#222;white-space:pre-wrap;">${escapeHtml(value) || '—'}</td>
        </tr>
      `).join('')}
    </table>
  `
  const text = fields.map(([label, value]) => `${label}: ${value || '—'}`).join('\n')

  try {
    await t.sendMail({
      from: `"Nivora Interiors Website" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: email,
      subject: `New Enquiry from ${fullName}`,
      text,
      html,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[Contact] Failed to send email:', err)
    res.status(502).json({ error: 'Failed to send email. Please try again later.' })
  }
})

export default router
