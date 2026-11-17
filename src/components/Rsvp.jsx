import { RSVP } from '../config'

export default function Rsvp() {
  return (
    <div className="mx-auto max-w-sm text-center">
      <p className="font-serif text-lg leading-snug text-ink text-balance">
        Votre présence nous ferait très plaisir. Merci de nous dire si vous serez des nôtres.
      </p>
      {RSVP.deadline && (
        <p className="mt-3 font-serif text-lg italic text-ink-soft">Réponse souhaitée avant le {RSVP.deadline}</p>
      )}

      <a
        href={RSVP.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-block rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[1.5px] shadow-[0_12px_24px_-12px_rgba(110,80,30,.7)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[.98]"
      >
        <span className="flex items-center gap-3 rounded-full bg-gradient-to-br from-[#d9b55c] to-[#a87d2b] px-6 py-3.5 text-ivory">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7 h18 v12 H3 Z" />
            <path d="M3 7 l9 7 l9 -7" />
          </svg>
          <span className="whitespace-nowrap font-display text-[0.72rem] tracking-[0.14em] uppercase">{RSVP.label}</span>
        </span>
      </a>
    </div>
  )
}
