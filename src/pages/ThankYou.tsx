import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import FadeIn from '../components/FadeIn'

export default function ThankYou() {
  return (
    <div className="bg-[#3b4a35] min-h-screen pt-20 flex items-center">
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-10 flex justify-center"
        >
          <div className="w-24 h-24 border border-[#b8966a]/30 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-[#b8966a]" strokeWidth={1.5} />
          </div>
        </motion.div>

        <FadeIn delay={0.3}>
          <p className="text-[#b8966a] text-[10px] tracking-[0.4em] uppercase mb-6">Enquiry Received</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#f5f0e8] font-light leading-tight mb-6">
            Success! Your Vision<br />
            <em className="text-[#b8966a]">Is in Good Hands.</em>
          </h1>
          <p className="text-[#f5f0e8]/50 font-light leading-relaxed max-w-md mx-auto mb-10">
            Thank you for reaching out to NIVORA. We've received your enquiry and will be in touch within 24 hours to schedule your free consultation.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="border border-[#b8966a]/15 p-8 mb-10 text-left">
            <p className="text-[#b8966a] text-[10px] tracking-[0.3em] uppercase mb-4">What Happens Next</p>
            <ol className="space-y-4">
              {[
                'We review your enquiry and match you with the right design approach.',
                'Shweta will personally reach out to schedule a free 30-minute consultation.',
                'We begin understanding your space, lifestyle, and vision.',
                'You receive a tailored design brief and next steps — at no cost.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4 text-[#f5f0e8]/50 text-sm font-light">
                  <span className="font-serif text-[#b8966a] shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>

        <FadeIn delay={0.7}>
          <div className="bg-[#3b4a35] p-8 mb-12">
            <p className="text-[#b8966a] text-[10px] tracking-[0.3em] uppercase mb-3">Free Download</p>
            <h3 className="font-serif text-2xl text-[#f5f0e8] font-light mb-3">2026 Interior Trend Guide</h3>
            <p className="text-[#f5f0e8]/40 text-sm font-light mb-6 leading-relaxed">
              While you wait, explore our curated guide to the interior trends shaping refined living spaces this year.
            </p>
            <button className="inline-flex items-center gap-2 border border-[#b8966a] text-[#b8966a] text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-[#b8966a] hover:text-[#3b4a35] transition-all duration-300">
              Download Guide <ArrowRight size={13} />
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-[#f5f0e8]/20 text-[#f5f0e8]/60 text-xs tracking-[0.2em] uppercase px-8 py-4 hover:border-[#b8966a] hover:text-[#b8966a] transition-all duration-300"
            >
              Back to Home
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 bg-[#b8966a] text-[#3b4a35] text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#d4b896] transition-all duration-300 font-medium"
            >
              Explore Our Work <ArrowRight size={13} />
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.9} className="mt-12">
          <a
            href="https://wa.me/917276687805?text=Hi%20Shweta%2C%20I%20just%20submitted%20an%20enquiry%20on%20your%20website%20and%20would%20love%20to%20chat."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f5f0e8]/30 text-sm font-light hover:text-[#b8966a] transition-colors duration-300"
          >
            Prefer to chat right now? Message us on WhatsApp →
          </a>
        </FadeIn>
      </div>
    </div>
  )
}
