import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    // URL-friendly unique identifier, e.g. "serenity-villa-mumbai"
    id: { type: String, required: true, unique: true, trim: true },

    // Card badge text displayed above the heading, e.g. "residential · 2024"
    badge: { type: String, default: '' },

    // Main heading shown on the card and hero
    name: { type: String, required: true, trim: true },

    // Subtitle / location shown below the heading
    location: { type: String, default: '', trim: true },

    // Project category for filtering
    category: {
      type: String,
      enum: ['residential', 'commercial', 'architecture'],
      required: true,
    },

    // Year completed
    year: { type: String, default: '' },

    // Display order on the portfolio page (lower = shown first)
    order: { type: Number, default: 0 },

    // ── Concept section ──────────────────────────────────────────────────────
    // Label above concept heading (e.g. "THE CONCEPT")
    conceptLabel: { type: String, default: 'The Concept' },

    // Concept heading / tagline (e.g. "Urban calm in a 3BHK canvas")
    concept: { type: String, default: '', trim: true },

    // Long-form concept body text
    description: { type: String, default: '', trim: true },

    // ── Design Intent section ────────────────────────────────────────────────
    // Label above design intent (e.g. "DESIGN INTENT")
    designIntentLabel: { type: String, default: 'Design Intent' },

    // Italic quote for the design intent block
    designIntent: { type: String, default: '', trim: true },

    // ── Materials ────────────────────────────────────────────────────────────
    materials: [{ type: String, trim: true }],

    // ── Images ───────────────────────────────────────────────────────────────
    // Cloudinary URL for the Portfolio page card thumbnail
    coverImage: { type: String, default: '' },

    // Cloudinary URL for the large banner image at the top of the project detail page
    heroImage: { type: String, default: '' },

    // Ordered array of Cloudinary URLs shown in the project detail page gallery
    images: [{ type: String }],
  },
  { timestamps: true }
)

projectSchema.pre('save', async function () {
  if (!this.badge) this.badge = `${this.category} · ${this.year}`
})

projectSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate()
  if (!update) return
  const set = update.$set || update
  if (!set.badge && set.category && set.year) {
    if (update.$set) update.$set.badge = `${set.category} · ${set.year}`
    else update.badge = `${set.category} · ${set.year}`
  }
})

// Delete cached model so updated hooks take effect on hot reload
delete mongoose.models.Project
export const Project = mongoose.model('Project', projectSchema)
