import { useState, useEffect, useRef } from 'react'
import ContactModal from './ContactModal'

const images = [
  '/assets/Murterino-1.png',
  '/assets/Murterino-2.png',
  '/assets/Murterino-3.png',
  '/assets/Murterino-4.png',
  <!-- 'https://images.unsplash.com/photo-1781593024459-9d81d1c46a19?w=1920&h=1080&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1634226951673-f7202dbad8f1?w=1920&h=1080&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1775153014048-b39155fa1ec8?w=1920&h=1080&fit=crop&auto=format', -->
]

export default function App() {
  const [current, setCurrent] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = (idx: number) => {
    if (idx === current) return
    setCurrent(idx)
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % images.length)
    }, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* All images stacked — CSS crossfade via opacity */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center will-change-[opacity]"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1800ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient overlay — sits above images */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 3 }}>
        {/* Domain title */}
        <div className="flex items-baseline justify-center leading-none">
          <h1
            className="text-white/90 text-center uppercase select-none"
            style={{
              fontFamily: '"Arial Black", Arial, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 12vw, 11.375rem)',
              textShadow: '0 2px 40px rgba(0,0,0,0.4)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            MURTERINO
          </h1>
          <span
            className="text-white/90 select-none"
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1rem, 3.5vw, 3.25rem)',
              textShadow: '0 2px 28px rgba(0,0,0,0.4)',
              lineHeight: 1,
              marginLeft: '-0.45em',
            }}
          >
            .com
          </span>
        </div>

        {/* Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-10 cursor-pointer group"
          style={{
            background: 'rgba(0,0,0,0.85)',
            borderRadius: '10px',
            padding: '0 2.5rem',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
            outline: 'none',
            transition: 'background 0.25s, border-color 0.25s, transform 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(30,30,30,0.95)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            e.currentTarget.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.85)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <span
            className="text-white/90 uppercase"
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 2.8vw, 2.625rem)',
              letterSpacing: '-0.04em',
            }}
          >
            For Sale
          </span>
        </button>

        {/* Price */}
        <p
          className="text-white uppercase select-none mt-3"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(0.75rem, 1.6vw, 1.4rem)',
            letterSpacing: '0',
            textShadow: '0 1px 12px rgba(0,0,0,0.4)',
          }}
        >
          €1699
        </p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5" style={{ zIndex: 4 }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="cursor-pointer rounded-full"
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              background: i === current ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              padding: 0,
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease',
            }}
          />
        ))}
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
