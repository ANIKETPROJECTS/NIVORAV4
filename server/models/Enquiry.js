import mongoose from 'mongoose'

// A single contact-form submission from the public Contact page.
// Kept separate from email delivery so a record always survives even if
// the email fails to send (misconfigured SMTP, Gmail outage, etc).
const enquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    spaceType: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    projectType: { type: String, default: '', trim: true },
    budget: { type: String, default: '', trim: true },
    referral: { type: String, default: '', trim: true },
    requirements: { type: String, default: '', trim: true },

    // Whether the notification email to the studio was sent successfully.
    emailSent: { type: Boolean, default: false },

    // Free-text notes an admin can add while triaging enquiries.
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

// Delete cached model so updated schema/hooks take effect on hot reload
delete mongoose.models.Enquiry
export const Enquiry = mongoose.model('Enquiry', enquirySchema)
