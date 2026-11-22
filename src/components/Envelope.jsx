import { useEffect, useRef, useState } from 'react'
import WaxSeal from './WaxSeal'
import { TataFrieze, ChevronBand } from './Tata'
import { COUPLE } from '../config'
import { GUEST } from '../lib/guest'

/*
 * Étapes de l'animation :
 * 0 attente · 1 le ruban se dénoue et le sceau se détache · 2 le rabat s'ouvre
 * 3 la carte sort de l'enveloppe · 4 l'écran d'accueil s'efface
 * Chaque valeur est le moment (en ms après le toucher) où l'étape commence ;
 * elles doivent rester dans l'ordre croissant. La carte reste lisible entre
 * l'étape 3 et l'étape 4, puis l'écran s'efface en 700 ms avant la fin.
 */
const TIMINGS = [0, 700, 1700, 8000, 8800]

// Poussière d'or : positions fixes pour que l'écran soit identique à chaque visite
const DUST = Array.from({ length: 16 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return {
    left: `${6 + r(1) * 88}%`,
    top: `${18 + r(2) * 70}%`,
    size: 2 + r(3) * 4,
    d: `${6 + r(4) * 6}s`,
    delay: `${-r(5) * 10}s`,
    o: 0.35 + r(6) * 0.5,
  }
})

// Dégradé or « satin » pour le ruban et les filets
const SATIN = 'linear-gradient(180deg, #6f501a 0%, #b8913a 18%, #f6e2a0 45%, #d9b55c 62%, #a87d2b 82%, #6f501a 100%)'

function FoilDefs({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#8a6a22" />
      <stop offset=".3" stopColor="#e4c97e" />
      <stop offset=".5" stopColor="#f6e2a0" />
      <stop offset=".7" stopColor="#b8913a" />
      <stop offset="1" stopColor="#8a6a22" />
    </linearGradient>
  )
}

// Ornement d'angle : équerre dorée et petits triangles Tata
function Corner({ className, flip = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={{ transform: flip }} aria-hidden="true">
      <g fill="none" stroke="url(#env-foil)" strokeWidth="1.1" strokeLinecap="round">
        <path d="M2 30 V2 H30" />
        <path d="M7 22 V7 H22" strokeOpacity=".7" />
      </g>
      <g fill="url(#env-foil)">
        <path d="M2 34 l2.4 4 h-4.8 Z" />
        <path d="M34 2 l4 2.4 v-4.8 Z" />
        <circle cx="12" cy="12" r="1.6" />
      </g>
    </svg>
  )
}

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
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 55%, #fffaf0 0%, #f6ecd6 55%, #ead9b4 100%)' }}
    >
      {/* dégradés partagés par les SVG de l'enveloppe */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <FoilDefs id="env-foil" />
        </defs>
      </svg>

      <div className="absolute inset-x-0 top-0 opacity-70">
        <ChevronBand />
      </div>

      {/* poussière d'or */}
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${stage >= 3 ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
        {DUST.map((p, i) => (
          <span
            key={i}
            className="gold-dust"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, '--d': p.d, '--delay': p.delay, '--o': p.o }}
          />
        ))}
      </div>

      <div
        className={`relative mb-14 text-center transition-all duration-700 ${stage >= 2 ? '-translate-y-4 opacity-0' : 'opacity-100'}`}
      >
        <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">Vous avez reçu une invitation</p>
        {GUEST && (
          <p className="mt-3 font-serif text-xl italic text-gold">
            {GUEST.salutation} {GUEST.name}
          </p>
        )}
        <p className="mt-3 font-serif text-sm italic text-gold/80">de la part de</p>
        <p className="mt-1 font-script text-4xl text-gold-foil">
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
        style={{ perspective: '1100px', containerType: 'inline-size' }}
      >
        {/* ombre portée au sol */}
        <div className="absolute -bottom-[9%] left-[8%] right-[8%] h-[10%] rounded-[50%] bg-[#6f501a]/25 blur-md" aria-hidden="true" />

        {/* dos de l'enveloppe, doublure visible une fois le rabat ouvert */}
        <div className="absolute inset-0 overflow-hidden rounded-[5px] bg-gradient-to-b from-[#efe2c6] to-[#e2cfa6] shadow-[0_30px_60px_-22px_rgba(90,60,15,.55),0_2px_0_rgba(255,255,255,.6)_inset] ring-1 ring-gold/40">
          <div className="envelope-liner absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 58%)' }} />
        </div>

        {/* carte intérieure */}
        <div
          className="absolute inset-x-[7%] top-[7%] bottom-[5%] z-[2] flex flex-col items-center justify-center rounded-[3px] bg-ivory px-[6%] text-center shadow-[0_8px_18px_-8px_rgba(90,60,15,.5)] ring-1 ring-gold/50 transition-transform duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{ transform: stage >= 3 ? 'translateY(-58%)' : 'translateY(0)' }}
        >
          <div className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-gold/60" />
          <div className="pointer-events-none absolute inset-[8px] rounded-[1px] border border-gold/25" />
          <Corner className="absolute left-[10px] top-[10px] w-[7%]" />
          <Corner className="absolute right-[10px] top-[10px] w-[7%]" flip="scaleX(-1)" />
          <Corner className="absolute bottom-[10px] left-[10px] w-[7%]" flip="scaleY(-1)" />
          <Corner className="absolute bottom-[10px] right-[10px] w-[7%]" flip="scale(-1)" />
          {GUEST && (
            <p className="mb-1.5 font-serif italic leading-tight text-ink" style={{ fontSize: '3.6cqw' }}>
              {GUEST.salutation} {GUEST.name},
            </p>
          )}
          <p className="font-display leading-relaxed text-gold uppercase" style={{ fontSize: '2.3cqw', letterSpacing: '0.24em' }}>
            Une nouvelle page de notre histoire s'annonce et nous tenons à ce que vous en fassiez partie.
          </p>
          <p className="mt-1 font-script text-gold-foil" style={{ fontSize: '8cqw', lineHeight: 1.1 }}>
            {COUPLE.initials[0]} &amp; {COUPLE.initials[1]}
          </p>
          <p className="font-display text-ink-soft" style={{ fontSize: '2.4cqw', letterSpacing: '0.25em' }}>C'est pour bientôt</p>
        </div>

        {/* poche avant : trois pans de papier, filets dorés et grain */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden rounded-[5px]"
          style={{ clipPath: 'polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)' }}
        >
          <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="pocket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#faf2e0" />
                <stop offset="1" stopColor="#eddfbf" />
              </linearGradient>
              <linearGradient id="side-l" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#efe2c6" />
                <stop offset="1" stopColor="#f5ead3" />
              </linearGradient>
              <linearGradient id="side-r" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="#e8d8b4" />
                <stop offset="1" stopColor="#f1e4c9" />
              </linearGradient>
            </defs>
            <path d="M0 0 L150 112 L0 200 Z" fill="url(#side-l)" />
            <path d="M300 0 L150 112 L300 200 Z" fill="url(#side-r)" />
            <path d="M0 200 L150 96 L300 200 Z" fill="url(#pocket)" />
            {/* ombres douces sous les pans */}
            <path d="M0 200 L150 96 L300 200" fill="none" stroke="#6f501a" strokeOpacity=".12" strokeWidth="4" transform="translate(0 -2)" />
            <g fill="none" strokeLinejoin="round">
              <path d="M0 0 L150 112 L300 0" stroke="#b8913a" strokeOpacity=".3" strokeWidth=".8" />
              <path d="M0 200 L150 96 L300 200" stroke="url(#env-foil)" strokeWidth="1.4" />
              <path d="M18 200 L150 108 L282 200" stroke="url(#env-foil)" strokeWidth=".6" strokeOpacity=".75" />
            </g>
          </svg>
          <div className="paper-grain absolute inset-0" />
          {/* filet doré tout autour de la face avant */}
          <div className="absolute inset-[3.5%] rounded-[2px] border border-gold/45" />
          <Corner className="absolute bottom-[5%] left-[3.5%] w-[7%]" flip="scaleY(-1)" />
          <Corner className="absolute bottom-[5%] right-[3.5%] w-[7%]" flip="scale(-1)" />
        </div>

        {/* nom de l'invité, calligraphié sur la poche comme une adresse */}
        <div className="pointer-events-none absolute inset-x-[14%] bottom-[7%] z-[3] text-center">
          {GUEST ? (
            <>
              <p className="font-display text-gold-dark uppercase" style={{ fontSize: '2.2cqw', letterSpacing: '0.35em' }}>
                À l'attention de
              </p>
              <p className="truncate font-script text-gold-foil" style={{ fontSize: '6.4cqw', lineHeight: 1.15 }}>
                {GUEST.name}
              </p>
            </>
          ) : (
            <div className="mx-auto w-1/2 opacity-60">
              <ChevronBand />
            </div>
          )}
        </div>

        {/* rabat : face papier dehors, doublure dedans */}
        <div
          className="absolute inset-x-0 top-0 h-[58%] transition-transform duration-[850ms] ease-in-out"
          style={{
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            transform: stage >= 2 ? 'rotateX(180deg)' : 'rotateX(0deg)',
            zIndex: stage >= 3 ? 1 : 4,
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <svg viewBox="0 0 300 116" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_4px_4px_rgba(90,60,15,.22)]" aria-hidden="true">
              <defs>
                <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f8eedb" />
                  <stop offset="1" stopColor="#e9d7b1" />
                </linearGradient>
              </defs>
              <path d="M0 0 L300 0 L150 116 Z" fill="url(#flap)" />
              <path d="M0 0 L150 116 L300 0" fill="none" stroke="url(#env-foil)" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M22 5 L278 5 L150 102 Z" fill="none" stroke="url(#env-foil)" strokeWidth=".6" strokeOpacity=".8" />
              <path d="M44 9 L256 9 L150 90 Z" fill="none" stroke="#b8913a" strokeWidth=".4" strokeOpacity=".45" strokeDasharray="1.5 2.5" />
            </svg>
            <div className="paper-grain absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          </div>
          <div
            className="envelope-liner absolute inset-0"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* reflet de lumière, seulement tant que l'enveloppe est fermée */}
        {stage === 0 && (
          <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-[5px]" aria-hidden="true">
            <div className="animate-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>
        )}

        {/* ruban de satin doré qui se dénoue de part et d'autre du sceau */}
        <div className="pointer-events-none absolute inset-x-0 top-[58%] z-[6] h-[4.5%] -translate-y-1/2" aria-hidden="true">
          {['left', 'right'].map((side) => (
            <div
              key={side}
              className="absolute top-0 h-full w-1/2 shadow-[0_2px_3px_rgba(90,60,15,.3)] transition-all duration-700 ease-in"
              style={{
                [side]: 0,
                background: SATIN,
                transform: stage >= 1 ? `translateX(${side === 'left' ? '-' : ''}110%)` : 'none',
                opacity: stage >= 1 ? 0 : 1,
              }}
            >
              <div className="absolute inset-x-0 top-[18%] h-px bg-[#fff4cf]/60" />
              <div className="absolute inset-x-0 bottom-[18%] h-px bg-[#6f501a]/40" />
            </div>
          ))}
        </div>

        {/* cachet de cire */}
        <div
          className={`absolute left-1/2 top-[58%] z-[7] w-[27%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
            stage >= 1 ? 'scale-125 rotate-12 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div className={`rounded-full ${stage === 0 ? 'seal-glow' : ''}`}>
            <WaxSeal className="block w-full drop-shadow-[0_5px_7px_rgba(90,60,15,.5)]" />
          </div>
        </div>
      </button>

      <p
        className={`relative mt-14 font-serif text-lg italic text-ink-soft transition-opacity duration-500 ${
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
