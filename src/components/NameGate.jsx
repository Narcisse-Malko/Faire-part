import { useState } from 'react'
import { findInvited } from '../lib/guest'
import WaxSeal from './WaxSeal'
import { TataDivider } from './Tata'

/*
 * Lien général : l'invité tape son nom avant de voir quoi que ce soit.
 * Nom sur la liste → on ouvre son invitation personnelle (enveloppe à son nom).
 * Sinon → il reste sur cet écran, qui ne montre aucune information du faire-part.
 */
export default function NameGate() {
  const [typed, setTyped] = useState('')
  const [error, setError] = useState(null) // null | 'unknown' | 'ambiguous'

  function open(e) {
    e.preventDefault()
    const found = findInvited(typed)
    if (!found?.person) {
      setError(found?.ambiguous ? 'ambiguous' : 'unknown')
      return
    }
    window.location.replace(`${window.location.pathname}?i=${found.person.link}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-8 text-center">
      <WaxSeal className="w-20 drop-shadow-[0_4px_6px_rgba(90,60,15,.35)]" />
      <h1 className="mt-6 font-script text-4xl leading-tight text-gold-foil">Bienvenue</h1>
      <p className="mt-4 max-w-xs font-serif text-lg leading-snug text-ink text-balance">
        Merci d’indiquer votre prénom et votre nom pour ouvrir votre invitation.
      </p>

      <form onSubmit={open} className="mt-6 flex w-full max-w-xs flex-col items-center gap-5">
        <label className="block w-full">
          <span className="sr-only">Votre prénom et votre nom</span>
          <input
            type="text"
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value)
              setError(null)
            }}
            placeholder="Prénom et nom"
            autoComplete="name"
            maxLength={120}
            className="w-full rounded-full border border-gold/50 bg-ivory/70 px-5 py-3 text-center font-serif text-lg text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!typed.trim()}
          className="inline-block rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[1.5px] shadow-[0_12px_24px_-12px_rgba(110,80,30,.7)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[.98] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <span className="block rounded-full bg-gradient-to-br from-[#d9b55c] to-[#a87d2b] px-6 py-3.5 font-display text-[0.72rem] tracking-[0.14em] uppercase text-ivory">
            Ouvrir mon invitation
          </span>
        </button>
      </form>

      {error && (
        <p className="mt-5 max-w-xs font-serif text-base text-ink text-balance" role="alert">
          {error === 'ambiguous'
            ? 'Plusieurs invités portent un nom proche. Merci d’écrire votre prénom et votre nom complets.'
            : 'Ce nom ne figure pas sur notre liste d’invités. Vérifiez l’orthographe, ou utilisez le lien personnel que vous avez reçu.'}
        </p>
      )}

      <TataDivider className="mt-8 w-full max-w-xs" />
    </main>
  )
}
