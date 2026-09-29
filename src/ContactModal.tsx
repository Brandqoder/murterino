import { useState, useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ContactModal({ open, onClose }: Props) {
  // `shown` trails `open` by one rAF so CSS can transition from the initial state
  const [shown, setShown] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const rafRef = useRef<number | null>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      // Mount first, then flip shown on next frame to trigger transition
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setShown(true))
      })
    } else {
      setShown(false)
      // Reset form state after exit animation completes
      resetTimerRef.current = setTimeout(() => {
        setSent(false)
        setName('')
        setEmail('')
        setMessage('')
      }, 400)
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [open])

  const handleClose = () => onClose()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('https://formspree.io/f/mdekbera', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })
    if (res.ok) setSent(true)
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    opacity: shown ? 1 : 0,
    pointerEvents: shown ? 'auto' : 'none',
    transition: 'opacity 0.35s ease',
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
    width: '100%',
    maxWidth: '440px',
    padding: '2.25rem',
    position: 'relative',
    transform: shown ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
    opacity: shown ? 1 : 0,
    transition: 'transform 0.35s cubic-bezier(0.34,1.3,0.64,1), opacity 0.3s ease',
  }

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0,0,0,0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.1rem',
            color: '#555',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
        >
          ✕
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
            <h2 style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontSize: '1.4rem', fontWeight: 900, color: '#111', margin: '0 0 0.5rem' }}>
              Message sent!
            </h2>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>We'll get back to you shortly.</p>
            <button
              onClick={handleClose}
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '0.6rem 1.75rem',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#333')}
              onMouseLeave={e => (e.currentTarget.style.background = '#000')}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#111', margin: '0 0 0.35rem' }}>
              Make an offer
            </h2>
            <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '0.875rem', color: '#777', margin: '0 0 1.5rem' }}>
              Interested in <strong style={{ color: '#111' }}>MURTERINO.com</strong>? Get in touch.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Your name', type: 'text', value: name, onChange: setName, placeholder: 'Jane Smith' },
                { label: 'Email address', type: 'email', value: email, onChange: setEmail, placeholder: 'jane@example.com' },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontFamily: 'Arial, sans-serif' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.65rem 1rem',
                      border: '1.5px solid #e5e5e5',
                      borderRadius: '10px',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '0.9rem',
                      color: '#111',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#111')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontFamily: 'Arial, sans-serif' }}>
                  Message
                </label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="I'm interested in purchasing this domain..."
                  rows={4}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.65rem 1rem',
                    border: '1.5px solid #e5e5e5',
                    borderRadius: '10px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '0.9rem',
                    color: '#111',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#111')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.transform = 'scale(1)' }}
              >
                Send message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
