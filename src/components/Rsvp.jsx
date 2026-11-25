import { useState } from 'react'
import { RSVP } from '../config'
import { GUEST, GUEST_KEY, findInvited } from '../lib/guest'
import { slug } from '../lib/slug'
import { ScriptName } from '../lib/caps'

/*
 * Confirmation de présence.
 * Invitation à une personne : un clic sur « Je confirme » ou « Je ne pourrai pas venir ».
 * Invitation à plusieurs personnes (couple…) : chacune choisit présent ou absent,
 * puis un seul envoi. Chaque personne a sa propre ligne dans la feuille Google,
 * sous la clé « <clé du lien>/<nom> », pour compter les présents nominativement.
 * Elles peuvent aussi inscrire leurs enfants (clé « <clé du lien>/enfant-<prénom> »).
 * Lien général : le nom tapé doit figurer dans la liste des invités (config.js).
 */

const PEOPLE = GUEST ? GUEST.people : null
const MULTI = PEOPLE && PEOPLE.length > 1
const STORAGE_KEY = `rsvp:${GUEST_KEY || 'general'}`
const CHILDREN_KEY = `${STORAGE_KEY}:enfants`
const MAX_CHILDREN = 8

// Réponses enregistrées sur cet appareil : { "Nom": "yes" | "no" }
function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    if (raw === 'yes' || raw === 'no') return PEOPLE && !MULTI ? { [PEOPLE[0]]: raw } : null // ancien format
    const v = JSON.parse(raw)
    return v && typeof v === 'object' ? v : null
  } catch {
    return null
  }
}

function readSavedChildren() {
  try {
    const v = JSON.parse(localStorage.getItem(CHILDREN_KEY) || '[]')
    return Array.isArray(v) ? v.map(String) : []
  } catch {
    return []
  }
}

function save(v, children) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(children))
  } catch {
    /* navigation privée : on ignore */
  }
}

const childKey = (child) => `${GUEST_KEY}/enfant-${slug(child)}`
// Évite les doublons « Léa » / « lea »
const addUnique = (list, child) => (child && !list.some((c) => slug(c) === slug(child)) ? [...list, child] : list)

async function post(key, name, attending) {
  const res = await fetch(RSVP.endpoint, {
    method: 'POST',
    // text/plain évite la requête préalable CORS que Google Apps Script refuse
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ key, name, attending }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error)
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

function GiftNote() {
  if (!RSVP.giftNote) return null
  return (
    <div className="mx-auto mt-6 max-w-xs">
      <div className="flex items-center justify-center gap-3 text-gold" aria-hidden="true">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold" />
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10 h16 v10 H4 Z" />
          <path d="M3 7 h18 v3 H3 Z" />
          <path d="M12 7 v13" />
          <path d="M12 7 C10 3 6 4 7.5 6.5 C8.5 7.5 12 7 12 7 C12 7 15.5 7.5 16.5 6.5 C18 4 14 3 12 7" />
        </svg>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold" />
      </div>
      <p className="mt-3 font-serif text-base italic leading-snug text-ink-soft text-balance">{RSVP.giftNote}</p>
    </div>
  )
}

// Ligne « Prénom NOM  [Présent·e] [Absent·e] » pour une invitation à plusieurs
function PersonChoice({ name, value, onChange, disabled }) {
  const pill = (active) =>
    `rounded-full px-3.5 py-1.5 font-display text-[0.6rem] tracking-[0.14em] uppercase transition-colors ring-1 ${
      active ? 'bg-gradient-to-br from-[#d9b55c] to-[#a87d2b] text-ivory ring-gold-dark/40' : 'bg-ivory/70 text-gold-dark ring-gold/50 hover:bg-gold-pale/60'
    }`
  return (
    <div className="flex flex-col items-center gap-2 border-b border-gold/25 py-4 last:border-b-0">
      <p className="font-serif text-lg leading-tight text-ink">{name}</p>
      <div className="flex gap-2" role="radiogroup" aria-label={`Réponse de ${name}`}>
        <button type="button" role="radio" aria-checked={value === 'yes'} disabled={disabled} onClick={() => onChange('yes')} className={pill(value === 'yes')}>
          Sera présent·e
        </button>
        <button type="button" role="radio" aria-checked={value === 'no'} disabled={disabled} onClick={() => onChange('no')} className={pill(value === 'no')}>
          Ne pourra pas venir
        </button>
      </div>
    </div>
  )
}

// Enfants accompagnant le couple : liste + champ « Ajouter »
function ChildrenEditor({ list, setList, pending, setPending, disabled }) {
  const add = () => {
    const child = pending.trim()
    if (!child) return
    setList((l) => addUnique(l, child))
    setPending('')
  }
  return (
    <div className="mx-auto mt-6 max-w-xs text-center">
      <p className="font-serif text-base italic text-ink-soft">Viendrez-vous avec vos enfants ? Inscrivez-les ici :</p>
      {list.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {list.map((c) => (
            <li key={c} className="flex items-center justify-between gap-3 border-b border-gold/20 pb-1.5 font-serif text-base text-ink">
              <span>{c}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => setList((l) => l.filter((x) => x !== c))}
                aria-label={`Retirer ${c}`}
                className="px-1 text-lg leading-none text-ink-soft hover:text-ink"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {list.length < MAX_CHILDREN && (
        <div className="mt-3 flex gap-2">
          <label className="flex-1">
            <span className="sr-only">Prénom et nom de l’enfant</span>
            <input
              type="text"
              value={pending}
              disabled={disabled}
              onChange={(e) => setPending(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  add()
                }
              }}
              placeholder="Prénom et nom de l’enfant"
              maxLength={80}
              className="w-full rounded-full border border-gold/50 bg-ivory/70 px-4 py-2 text-center font-serif text-base text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={add}
            disabled={disabled || !pending.trim()}
            className="rounded-full bg-ivory/70 px-4 py-2 font-display text-[0.6rem] tracking-[0.14em] uppercase text-gold-dark ring-1 ring-gold/50 hover:bg-gold-pale/60 disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  )
}

export default function Rsvp() {
  const [answers, setAnswers] = useState(readSaved) // réponses envoyées
  const [draft, setDraft] = useState(() => readSaved() || {}) // choix en cours (invitation à plusieurs)
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [savedChildren, setSavedChildren] = useState(readSavedChildren) // enfants envoyés
  const [children, setChildren] = useState(readSavedChildren) // enfants en cours de saisie
  const [pendingChild, setPendingChild] = useState('')
  const [typedName, setTypedName] = useState('')
  const [notInvited, setNotInvited] = useState(null) // null | 'unknown' | 'ambiguous'
  const [editing, setEditing] = useState(false)

  const sending = status === 'sending'

  async function submit(result) {
    if (sending) return
    // Lien général : seules les personnes de la liste des invités peuvent répondre.
    let invited = null
    if (!GUEST) {
      const found = findInvited(typedName)
      if (!found?.person) {
        setNotInvited(found?.ambiguous ? 'ambiguous' : 'unknown')
        return
      }
      setNotInvited(null)
      invited = found.person
      result = { [invited.name]: Object.values(result)[0] }
    }
    // Enfants : inscrits seulement si au moins un parent vient ; ceux retirés passent « Absent ».
    const kids = MULTI && Object.values(result).includes('yes') ? addUnique(children, pendingChild.trim()) : []
    const removed = MULTI ? savedChildren.filter((c) => !kids.some((k) => slug(k) === slug(c))) : []
    setStatus('sending')
    try {
      if (!GUEST) {
        await post(invited.key, invited.name, result[invited.name] === 'yes')
      } else if (!MULTI) {
        await post(GUEST_KEY, PEOPLE[0], result[PEOPLE[0]] === 'yes')
      } else {
        await Promise.all([
          ...PEOPLE.map((p) => post(`${GUEST_KEY}/${slug(p)}`, p, result[p] === 'yes')),
          ...kids.map((c) => post(childKey(c), `${c} (enfant)`, true)),
          ...removed.map((c) => post(childKey(c), `${c} (enfant)`, false)),
        ])
      }
      save(result, kids)
      setAnswers(result)
      setSavedChildren(kids)
      setChildren(kids)
      setPendingChild('')
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

  const errorMessage = status === 'error' && (
    <p className="mt-4 font-serif text-base text-ink" role="alert">
      La réponse n'a pas pu être envoyée. Vérifiez votre connexion et réessayez.
    </p>
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

  // ——— Réponse déjà envoyée ———
  if (answers && !editing) {
    const values = Object.values(answers)
    const anyYes = values.includes('yes')
    const allYes = values.every((v) => v === 'yes')
    const message = !anyYes
      ? 'Nous avons bien noté que vous ne pourrez pas être des nôtres. Vous serez dans nos pensées.'
      : allYes
        ? 'Votre présence est bien confirmée. Nous avons hâte de célébrer ce jour avec vous.'
        : 'Vos réponses sont bien enregistrées. Nous avons hâte de célébrer ce jour avec vous.'

    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="font-script text-4xl leading-tight text-gold-dark text-balance">
          Merci{GUEST && <> <ScriptName text={GUEST.name} /></>} !
        </p>
        <p className="mt-4 font-serif text-lg leading-snug text-ink text-balance">{message}</p>
        {MULTI && (
          <ul className="mx-auto mt-5 max-w-xs space-y-1.5">
            {PEOPLE.map((p) => (
              <li key={p} className="flex items-baseline justify-between gap-3 border-b border-gold/20 pb-1.5 font-serif text-base">
                <span className="text-ink">{p}</span>
                <span className={`font-display text-[0.6rem] tracking-[0.14em] uppercase ${answers[p] === 'yes' ? 'text-gold-dark' : 'text-ink-soft'}`}>
                  {answers[p] === 'yes' ? 'Présent·e' : 'Absent·e'}
                </span>
              </li>
            ))}
            {savedChildren.map((c) => (
              <li key={`enfant-${c}`} className="flex items-baseline justify-between gap-3 border-b border-gold/20 pb-1.5 font-serif text-base">
                <span className="text-ink">
                  {c} <span className="italic text-ink-soft">(enfant)</span>
                </span>
                <span className="font-display text-[0.6rem] tracking-[0.14em] uppercase text-gold-dark">Présent·e</span>
              </li>
            ))}
          </ul>
        )}
        {anyYes && <GiftNote />}
        <button
          type="button"
          onClick={() => {
            setDraft(answers)
            setChildren(savedChildren)
            setEditing(true)
          }}
          className="mt-6 font-serif text-base italic text-ink-soft underline decoration-gold/50 underline-offset-4 hover:text-ink"
        >
          Modifier {MULTI ? 'nos réponses' : 'ma réponse'}
        </button>
      </div>
    )
  }

  // ——— Invitation à plusieurs : un choix par personne ———
  if (MULTI) {
    const complete = PEOPLE.every((p) => draft[p] === 'yes' || draft[p] === 'no')
    return (
      <div className="mx-auto max-w-sm text-center">
        {intro}
        <p className="mt-5 font-serif text-base italic text-ink-soft">Une réponse pour chacun, s'il vous plaît :</p>
        <div className="mx-auto mt-2 max-w-xs rounded-[6px] bg-ivory/60 px-4 ring-1 ring-gold/30">
          {PEOPLE.map((p) => (
            <PersonChoice key={p} name={p} value={draft[p]} disabled={sending} onChange={(v) => setDraft((d) => ({ ...d, [p]: v }))} />
          ))}
        </div>
        {PEOPLE.some((p) => draft[p] === 'yes') && (
          <ChildrenEditor list={children} setList={setChildren} pending={pendingChild} setPending={setPendingChild} disabled={sending} />
        )}
        <div className="mt-8">
          <GoldButton onClick={() => submit(Object.fromEntries(PEOPLE.map((p) => [p, draft[p]])))} disabled={sending || !complete}>
            {sending ? 'Envoi…' : 'Envoyer nos réponses'}
          </GoldButton>
        </div>
        {errorMessage}
      </div>
    )
  }

  // ——— Invitation à une personne, ou lien général ———
  const name = GUEST ? PEOPLE[0] : typedName.trim()
  return (
    <div className="mx-auto max-w-sm text-center">
      {intro}

      {!GUEST && (
        <label className="mt-6 block">
          <span className="sr-only">Votre nom</span>
          <input
            type="text"
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value)
              setNotInvited(null)
            }}
            placeholder="Votre nom et prénom"
            maxLength={120}
            className="w-full rounded-full border border-gold/50 bg-ivory/70 px-5 py-3 text-center font-serif text-lg text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none"
          />
        </label>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <GoldButton onClick={() => submit({ [name]: 'yes' })} disabled={sending || !name}>
          {sending ? 'Envoi…' : RSVP.label}
        </GoldButton>
        <button
          type="button"
          onClick={() => submit({ [name]: 'no' })}
          disabled={sending || !name}
          className="font-serif text-base italic text-ink-soft underline decoration-gold/50 underline-offset-4 hover:text-ink disabled:opacity-50"
        >
          Je ne pourrai malheureusement pas venir
        </button>
      </div>

      {notInvited && (
        <p className="mt-4 font-serif text-base text-ink text-balance" role="alert">
          {notInvited === 'ambiguous'
            ? 'Plusieurs invités portent un nom proche. Merci d’écrire votre prénom et votre nom complets.'
            : 'Ce nom ne figure pas sur notre liste d’invités. Vérifiez l’orthographe, ou utilisez le lien personnel que vous avez reçu.'}
        </p>
      )}
      {errorMessage}
    </div>
  )
}
