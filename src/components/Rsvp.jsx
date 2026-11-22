import { useState } from 'react'
import { RSVP } from '../config'
import { GUEST, GUEST_KEY } from '../lib/guest'

const STORAGE_KEY = `rsvp:${GUEST_KEY || 'general'}`

function readSaved() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'yes' || v === 'no' ? v : null
  } catch {
    return null
  }
}

function save(v) {
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch {
    /* navigation privée : on ignore */
  }
}

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7 h18 v12 H3 Z" />
    <path d="M3 7 l9 7 l9 -7" />
  </svg>
)

function GoldButton({ children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className="group inline-block rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[1.5px] shadow-[0_12px_24px_-12px_rgba(110,80,30,.7)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[.98] disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <span className="flex items-center gap-3 rounded-full bg-gradient-to-br from-[#d9b55c] to-[#a87d2b] px-6 py-3.5 text-ivory">
        <MailIcon />
        <span className="whitespace-nowrap font-display text-[0.72rem] tracking-[0.14em] uppercase">{children}</span>
      </span>
    </button>
  )
}

export default function Rsvp() {
  const [answer, setAnswer] = useState(readSaved)
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [typedName, setTypedName] = useState('')
  const [editing, setEditing] = useState(false)

  const name = GUEST ? GUEST.name : typedName.trim()

  async function send(attending) {
    if (!name || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(RSVP.endpoint, {
        method: 'POST',
        // text/plain évite la requête préalable CORS que Google Apps Script refuse
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ key: GUEST_KEY || '', name, attending }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      const v = attending ? 'yes' : 'no'
      save(v)
      setAnswer(v)
      setEditing(false)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  const intro = (
    <>
      <p className="font-serif text-lg leading-snug text-ink text-balance">
        {GUEST ? `${GUEST.name}, votre` : 'Votre'} présence nous ferait très plaisir. Merci de nous dire si vous serez des nôtres.
      </p>
      {RSVP.deadline && (
        <p className="mt-3 font-serif text-lg italic text-ink-soft">Réponse souhaitée avant le {RSVP.deadline}</p>
      )}
    </>
  )

  // Tant que le script Google n'est pas branché, on garde l'ancien lien vers le formulaire.
  if (!RSVP.endpoint) {
    return (
      <div className="mx-auto max-w-sm text-center">
        {intro}
        <a
          href={RSVP.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-block rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[1.5px] shadow-[0_12px_24px_-12px_rgba(110,80,30,.7)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[.98]"
        >
          <span className="flex items-center gap-3 rounded-full bg-gradient-to-br from-[#d9b55c] to-[#a87d2b] px-6 py-3.5 text-ivory">
            <MailIcon />
            <span className="whitespace-nowrap font-display text-[0.72rem] tracking-[0.14em] uppercase">{RSVP.label}</span>
          </span>
        </a>
      </div>
    )
  }

  if (answer && !editing) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="font-script text-4xl text-gold-dark">Merci{GUEST ? ` ${GUEST.name}` : ''} !</p>
        <p className="mt-4 font-serif text-lg leading-snug text-ink text-balance">
          {answer === 'yes'
            ? 'Votre présence est bien confirmée. Nous avons hâte de célébrer ce jour avec vous.'
            : 'Nous avons bien noté que vous ne pourrez pas être des nôtres. Vous serez dans nos pensées.'}
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-6 font-serif text-base italic text-ink-soft underline decoration-gold/50 underline-offset-4 hover:text-ink"
        >
          Modifier ma réponse
        </button>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <div className="mx-auto max-w-sm text-center">
      {intro}

      {!GUEST && (
        <label className="mt-6 block">
          <span className="sr-only">Votre nom</span>
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Votre nom et prénom"
            maxLength={120}
            className="w-full rounded-full border border-gold/50 bg-ivory/70 px-5 py-3 text-center font-serif text-lg text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none"
          />
        </label>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <GoldButton onClick={() => send(true)} disabled={sending || !name}>
          {sending ? 'Envoi…' : RSVP.label}
        </GoldButton>
        <button
          type="button"
          onClick={() => send(false)}
          disabled={sending || !name}
          className="font-serif text-base italic text-ink-soft underline decoration-gold/50 underline-offset-4 hover:text-ink disabled:opacity-50"
        >
          Je ne pourrai malheureusement pas venir
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-4 font-serif text-base text-ink" role="alert">
          La réponse n'a pas pu être envoyée. Vérifiez votre connexion et réessayez.
        </p>
      )}
    </div>
  )
}
