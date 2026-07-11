import mongoose from 'mongoose'

const statItemSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false })

const serviceCardSchema = new mongoose.Schema({
  img: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
}, { _id: false })

const portfolioItemSchema = new mongoose.Schema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  location: { type: String, default: '' },
  category: { type: String, default: '' },
  serviceHref: { type: String, default: '' },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
}, { _id: false })

const homeHeroSchema = new mongoose.Schema({
  backgroundImage: { type: String, default: '' },
  headline: { type: String, default: '' },
  subheadline: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
}, { _id: false })

const servicePageHeroSchema = new mongoose.Schema({
  backgroundImage: { type: String, default: '' },
  headline: { type: String, default: '' },
  subheadline: { type: String, default: '' },
}, { _id: false })

const serviceItemSchema = new mongoose.Schema({
  img: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
}, { _id: false })

const siteSettingsSchema = new mongoose.Schema({
  // Singleton — always one document
  _singleton: { type: String, default: 'default', unique: true },

  // ── Header / Footer ──────────────────────────────────────────────────────────
  logoUrl: { type: String, default: '' },
  logoSize: { type: Number, default: 38, min: 20, max: 100 },
  footerLogoUrl: { type: String, default: '' },
  footerLogoSize: { type: Number, default: 200, min: 80, max: 400 },

  // ── Home Page ────────────────────────────────────────────────────────────────
  homeHero: { type: homeHeroSchema, default: () => ({}) },
  serviceCards: { type: [serviceCardSchema], default: [] },
  homePortfolio: { type: [portfolioItemSchema], default: [] },
  homeStats: { type: [statItemSchema], default: [
    { value: '2+',  label: 'Years Experience'    },
    { value: '25+', label: 'Projects Completed'  },
    { value: '50+', label: 'Clients Served'      },
    { value: '90%', label: 'Client Satisfaction' },
  ]},

  // ── About Page ───────────────────────────────────────────────────────────────
  aboutStats: { type: [statItemSchema], default: [
    { value: '25+',  label: 'Clients Served'         },
    { value: '2',    label: 'Years of Experience'     },
    { value: '2',    label: 'Cities — Mumbai & Pune'  },
    { value: '100%', label: 'End-to-End Solutions'    },
  ]},

  // ── Service Page ─────────────────────────────────────────────────────────────
  servicePageHero: { type: servicePageHeroSchema, default: () => ({}) },
  servicesList: { type: [serviceItemSchema], default: [] },

}, { timestamps: true })

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema)
