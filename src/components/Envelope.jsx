import { useEffect, useRef, useState } from 'react'
import WaxSeal from './WaxSeal'
import { TataFrieze, ChevronBand } from './Tata'
import { COUPLE } from '../config'

/*
 * Étapes de l'animation :
 * 0 attente · 1 le sceau se détache · 2 le rabat s'ouvre
 * 3 la carte sort de l'enveloppe · 4 l'écran d'accueil s'efface
 */
const TIMINGS = [0, 650, 1650, 15000, 8800]

export default function Envelope({ onOpened }) {
  const [stage, setStage] = useState(0)
  const timers = useRef([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const open = () => {
    if (stage > 0) return
    setStage(1)
    timers.current = [
      setTimeout(() => setStage(2), TIMINGS[1]),
      setTimeout(() => setStage(3), TIMINGS[2]),
      setTimeout(() => setStage(4), TIMINGS[3]),
      setTimeout(() => {
        document.body.style.overflow = ''
        onOpened?.()
      }, TIMINGS[4]),
    ]
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cream px-6 transition-opacity duration-700 ${
        stage >= 4 ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-x-0 top-0 opacity-70">
        <ChevronBand />
      </div>

      <div
        className={`mb-14 text-center transition-all duration-700 ${stage >= 2 ? '-translate-y-4 opacity-0' : 'opacity-100'}`}
      >
        <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">Vous avez reçu une invitation</p>
        <p className="mt-3 font-script text-4xl text-gold-foil">
          {COUPLE.groom} &amp; {COUPLE.bride}
        </p>
      </div>

      <button
        type="button"
        onClick={open}
        aria-label="Ouvrir le faire-part"
        className={`relative aspect-[3/2] w-[min(86vw,400px)] cursor-pointer outline-none transition-transform duration-[900ms] ${
          stage >= 4 ? 'scale-110' : stage === 0 ? 'animate-floaty' : ''
        }`}
        style={{ perspective: '1100px' }}
      >
        {/* dos de l'enveloppe */}
        <div className="absolute inset-0 rounded-[4px] bg-gradient-to-b from-[#efe2c6] to-[#e4d3ad] shadow-[0_25px_50px_-18px_rgba(110,80,30,.45)] ring-1 ring-gold/30" />
        <div
          className="absolute inset-0 bg-[#dccaa1]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 56%)' }}
        />

        {/* carte intérieure */}
        <div
          className="absolute inset-x-[7%] top-[7%] bottom-[5%] z-[2] flex flex-col items-center justify-center rounded-[3px] bg-ivory shadow-md ring-1 ring-gold/40 transition-transform duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{ transform: stage >= 3 ? 'translateY(-58%)' : 'translateY(0)' }}
        >
          <div className="absolute inset-2 rounded-[2px] border border-gold/40" />
          <p className="font-display text-[0.55rem] tracking-[0.3em] text-gold uppercase">Une nouvelle page de notre histoire s'annonce et nous tenons à ce que vous en fassiez partie.</p>
          <p className="mt-1 font-script text-3xl text-gold-dark">
            {COUPLE.initials[0]} &amp; {COUPLE.initials[1]}
          </p>
          <p className="mt-1 font-display text-[0.6rem] tracking-[0.25em] text-ink-soft">C'est pour bientôt</p>
        </div>

        {/* poche avant */}
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 z-[3] h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="pocket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f8efdc" />
              <stop offset="1" stopColor="#efe2c4" />
            </linearGradient>
          </defs>
          <path d="M0 0 L150 112 L0 200 Z" fill="#f1e5cb" />
          <path d="M300 0 L150 112 L300 200 Z" fill="#ede0c2" />
          <path d="M0 200 L150 98 L300 200 Z" fill="url(#pocket)" />
          <g stroke="#c9a85a" strokeWidth=".8" fill="none" opacity=".8">
            <path d="M0 0 L150 112 L300 0" strokeOpacity=".35" />
            <path d="M0 200 L150 98 L300 200" />
          </g>
        </svg>
        <div className="absolute inset-x-[30%] bottom-[6%] z-[3] opacity-60">
          <ChevronBand />
        </div>

        {/* rabat */}
        <div
          className="absolute inset-x-0 top-0 h-[58%] transition-transform duration-[850ms] ease-in-out"
          style={{
            transformOrigin: 'top center',
            transform: stage >= 2 ? 'rotateX(180deg)' : 'rotateX(0deg)',
            zIndex: stage >= 3 ? 1 : 4,
          }}
        >
          <svg viewBox="0 0 300 116" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_3px_3px_rgba(110,80,30,.18)]" aria-hidden="true">
            <defs>
              <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6ebd3" />
                <stop offset="1" stopColor="#ead9b4" />
              </linearGradient>
            </defs>
            <path d="M0 0 L300 0 L150 116 Z" fill="url(#flap)" stroke="#c9a85a" strokeWidth=".8" />
            <path d="M14 4 L286 4 L150 108 Z" fill="none" stroke="#c9a85a" strokeWidth=".5" strokeOpacity=".6" />
          </svg>
        </div>

        {/* cachet de cire */}
        <div
          className={`absolute left-1/2 top-[58%] z-[5] w-[27%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
            stage >= 1 ? 'scale-125 rotate-12 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div className={`rounded-full ${stage === 0 ? 'seal-glow' : ''}`}>
            <WaxSeal className="block w-full drop-shadow-[0_4px_6px_rgba(90,60,15,.45)]" />
          </div>
        </div>
      </button>

      <p
        className={`mt-12 font-serif text-lg italic text-ink-soft transition-opacity duration-500 ${
          stage === 0 ? 'animate-pulse opacity-100' : 'opacity-0'
        }`}
      >
        Touchez le sceau pour ouvrir
      </p>

      <div className="absolute inset-x-0 bottom-0 opacity-80">
        <TataFrieze height={70} />
      </div>
    </div>
  )
}
