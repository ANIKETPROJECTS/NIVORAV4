import { useState, useEffect, useRef, ChangeEvent } from 'react'
import {
  fetchSiteSettings, updateSiteSettings, uploadSiteImage,
  SiteSettings, ServiceCard, HomePortfolioItem,
} from '../../lib/api'
import { invalidateSiteSettings } from '../../hooks/useSiteSettings'
import { Upload, Loader2, Save } from 'lucide-react'

export type SettingsSection = 'header' | 'footer' | 'expertise' | 'portfolio'

const GOLD = '#7a6245'

// ── Shared sub-components ─────────────────────────────────────────────────────

function ImageUploadField({
  label,
  hint,
  currentUrl,
  onUploaded,
}: {
  label: string
  hint?: string
  currentUrl: string
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadSiteImage(file)
      onUploaded(url)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={{ fontSize: 12, color: '#b0a498', margin: '0 0 10px' }}>{hint}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={label}
            style={{
              height: 64, width: 'auto', maxWidth: 200, objectFit: 'contain',
              borderRadius: 6, border: '1px solid #e2d9ce', background: '#f5f0e8', padding: 6,
            }}
          />
        ) : (
          <div style={{
            height: 64, width: 140, borderRadius: 6, border: '2px dashed #e2d9ce',
            background: '#faf8f5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#c0b5a8', fontSize: 11,
          }}>
            No image
          </div>
        )}
        <div>
          <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
          <button onClick={() => ref.current?.click()} disabled={uploading} style={uploadBtnStyle}>
            {uploading
              ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
              : <Upload size={13} />}
            {uploading ? 'Uploading…' : currentUrl ? 'Replace Image' : 'Upload Image'}
          </button>
          {currentUrl && (
            <p style={{ fontSize: 11, color: '#c0b5a8', marginTop: 5 }}>
              Served from Cloudinary CDN
            </p>
          )}
        </div>
      </div>
      {error && <p style={{ color: '#b85a4a', fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  )
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
      {children}
    </div>
  )
}

function TextField({
  label, value, onChange, multiline,
}: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          style={{ ...inputStyle, height: 64, resize: 'vertical' }}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  )
}

function SaveBar({
  saving, onSave, success, error, onClearError,
}: {
  saving: boolean
  onSave: () => void
  success: string
  error: string
  onClearError: () => void
}) {
  return (
    <div style={{ paddingTop: 8, paddingBottom: 48 }}>
      {success && (
        <div style={successStyle}>{success}</div>
      )}
      {error && (
        <div style={errorStyle}>
          {error}
          <button onClick={onClearError} style={{ background: 'none', border: 'none', color: '#b85a4a', cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>
      )}
      <button onClick={onSave} disabled={saving} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: GOLD, color: '#fff', border: 'none', borderRadius: 4,
        padding: '10px 28px', fontSize: 13, letterSpacing: '0.08em',
        cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600,
        textTransform: 'uppercase', opacity: saving ? 0.7 : 1,
        marginTop: success || error ? 12 : 0,
      }}>
        {saving
          ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          : <Save size={14} />}
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

// ── Section panels ────────────────────────────────────────────────────────────

function HeaderPanel({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
  return (
    <div>
      <p style={descStyle}>
        The logo shown in the top navigation bar across the entire website.
      </p>
      <ImageUploadField
        label="Navbar Logo"
        hint="Displayed at 38px height. Works best as a wide PNG with transparent background."
        currentUrl={settings.logoUrl}
        onUploaded={url => onChange({ ...settings, logoUrl: url })}
      />
    </div>
  )
}

function FooterPanel({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
  return (
    <div>
      <p style={descStyle}>
        The logo shown in the footer. A version with a light/transparent background works best on the dark footer.
      </p>
      <ImageUploadField
        label="Footer Logo"
        hint="Displayed at 200px wide. Background is auto-removed on display."
        currentUrl={settings.footerLogoUrl}
        onUploaded={url => onChange({ ...settings, footerLogoUrl: url })}
      />
    </div>
  )
}

function ExpertisePanel({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
  const update = (i: number, card: ServiceCard) => {
    const cards = [...settings.serviceCards]
    cards[i] = card
    onChange({ ...settings, serviceCards: cards })
  }

  return (
    <div>
      <p style={descStyle}>
        The 4 cards in the <strong>"Spaces Designed for Every Lifestyle"</strong> section on the homepage. Each card has an image, title, and description.
      </p>
      {settings.serviceCards.map((card, i) => (
        <div key={i} style={cardBoxStyle}>
          <p style={cardIndexStyle}>Card {i + 1}</p>
          <ImageUploadField
            label="Image"
            currentUrl={card.img}
            onUploaded={url => update(i, { ...card, img: url })}
          />
          <TextField label="Title" value={card.title} onChange={v => update(i, { ...card, title: v })} />
          <div style={{ marginTop: 10 }}>
            <TextField label="Description" value={card.desc} onChange={v => update(i, { ...card, desc: v })} multiline />
          </div>
        </div>
      ))}
    </div>
  )
}

function PortfolioPanel({ settings, onChange }: { settings: SiteSettings; onChange: (s: SiteSettings) => void }) {
  const update = (i: number, item: HomePortfolioItem) => {
    const items = [...settings.homePortfolio]
    items[i] = item
    onChange({ ...settings, homePortfolio: items })
  }

  return (
    <div>
      <p style={descStyle}>
        6 curated portfolio highlights managed separately from the portfolio database. Edit image, name, location, category, and description for each.
      </p>
      {settings.homePortfolio.map((item, i) => (
        <div key={i} style={cardBoxStyle}>
          <p style={cardIndexStyle}>Item {i + 1} — {item.name || '(unnamed)'}</p>
          <ImageUploadField
            label="Image"
            currentUrl={item.img}
            onUploaded={url => update(i, { ...item, img: url })}
          />
          <FieldRow>
            <TextField label="Name" value={item.name} onChange={v => update(i, { ...item, name: v })} />
            <TextField label="Location" value={item.location} onChange={v => update(i, { ...item, location: v })} />
          </FieldRow>
          <FieldRow>
            <TextField label="Category" value={item.category} onChange={v => update(i, { ...item, category: v })} />
            <TextField label="Service Link" value={item.serviceHref} onChange={v => update(i, { ...item, serviceHref: v })} />
          </FieldRow>
          <TextField label="Description" value={item.desc} onChange={v => update(i, { ...item, desc: v })} multiline />
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  section: SettingsSection
}

export default function AdminSiteSettings({ section }: Props) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchSiteSettings()
      .then(data => {
        setSettings({
          ...data,
          serviceCards: data.serviceCards ?? [],
          homePortfolio: data.homePortfolio ?? [],
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Reset status messages when switching sections
  useEffect(() => {
    setSuccess('')
    setError('')
  }, [section])

  const save = async () => {
    if (!settings) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const updated = await updateSiteSettings(settings)
      invalidateSiteSettings({ ...updated, serviceCards: updated.serviceCards ?? [], homePortfolio: updated.homePortfolio ?? [] })
      setSettings({ ...updated, serviceCards: updated.serviceCards ?? [], homePortfolio: updated.homePortfolio ?? [] })
      setSuccess('Changes saved successfully.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '80px 0', color: '#b0a498' }}>
        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> Loading…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!settings) {
    return <div style={{ padding: '40px 0', color: '#b85a4a' }}>Failed to load settings. Please refresh.</div>
  }

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {section === 'header'    && <HeaderPanel    settings={settings} onChange={setSettings} />}
      {section === 'footer'    && <FooterPanel    settings={settings} onChange={setSettings} />}
      {section === 'expertise' && <ExpertisePanel settings={settings} onChange={setSettings} />}
      {section === 'portfolio' && <PortfolioPanel settings={settings} onChange={setSettings} />}

      <SaveBar
        saving={saving}
        onSave={save}
        success={success}
        error={error}
        onClearError={() => setError('')}
      />
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
  color: '#9a8e82', fontWeight: 600, marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 11px', border: '1px solid #ddd7ce', borderRadius: 4,
  fontSize: 13, color: '#2a2218', fontFamily: 'inherit', outline: 'none',
  background: '#faf8f5', transition: 'border-color 0.2s',
}

const uploadBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'none', border: '1px solid #c8bfb2', color: GOLD,
  borderRadius: 4, padding: '8px 14px', fontSize: 12, cursor: 'pointer',
  letterSpacing: '0.04em', transition: 'all 0.2s', fontFamily: 'inherit',
}

const descStyle: React.CSSProperties = {
  fontSize: 13, color: '#9a8e82', marginBottom: 24, lineHeight: 1.6,
}

const cardBoxStyle: React.CSSProperties = {
  border: '1px solid #e2d9ce', borderRadius: 8, padding: '20px 24px',
  marginBottom: 16, background: '#fff',
}

const cardIndexStyle: React.CSSProperties = {
  margin: '0 0 16px', fontSize: 11, fontWeight: 700, color: '#c0b5a8',
  letterSpacing: '0.18em', textTransform: 'uppercase',
}

const successStyle: React.CSSProperties = {
  marginBottom: 12, background: '#f0f7f0', border: '1px solid #b5d9b5',
  color: '#3a7a3a', borderRadius: 4, padding: '10px 16px', fontSize: 13,
}

const errorStyle: React.CSSProperties = {
  marginBottom: 12, background: '#fdf0ee', border: '1px solid #e8b5ad',
  color: '#b85a4a', borderRadius: 4, padding: '10px 16px', fontSize: 13,
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
