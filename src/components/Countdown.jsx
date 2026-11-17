import { useEffect, useState } from 'react'
import { EVENT_DATE } from '../config'

function diff() {
  const ms = Math.max(0, EVENT_DATE.getTime() - Date.now())
  const s = Math.floor(ms / 1000)
  return {
    done: ms === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

// Chaque case est coiffée d'un petit toit conique, comme une tour Tata
function Tile({ value, label }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 80 26" className="-mb-px w-full" aria-hidden="true">
        <path d="M2 25 L40 3 L78 25 Z" fill="#efe1bf" stroke="#b8913a" strokeWidth="1" strokeLinejoin="round" />
        <g stroke="#b8913a" strokeOpacity=".4" strokeWidth=".7">
          {[14, 27, 40, 53, 66].map((x) => (
            <line key={x} x1="40" y1="5" x2={x} y2="24" />
          ))}
        </g>
        <path d="M40 3 V0" stroke="#b8913a" />
      </svg>
      <div className="flex w-[88%] flex-col items-center rounded-b-[4px] border border-t-0 border-gold/70 bg-ivory py-3 shadow-[0_10px_20px_-14px_rgba(110,80,30,.6)]">
        <span key={text} className="animate-tick font-display text-[1.75rem] leading-none text-gold-dark tabular-nums">
          {text}
        </span>
        <span className="mt-2 font-serif text-[0.8rem] tracking-[0.12em] text-ink-soft uppercase">{label}</span>
      </div>
    </div>
  )
}

export default function Countdown() {
  const [t, setT] = useState(diff)

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.done) {
    return <p className="text-center font-script text-5xl text-gold-foil">C'est le grand jour !</p>
  }

  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-4" role="timer" aria-live="off">
      <Tile value={t.days} label={t.days > 1 ? 'Jours' : 'Jour'} />
      <Tile value={t.hours} label="Heures" />
      <Tile value={t.minutes} label="Min" />
      <Tile value={t.seconds} label="Sec" />
    </div>
  )
}
