import { GUESTS, LINKS } from '../config'
import { slug } from './slug'

function defaultSalutation(name) {
  if (/(\s(et)\s|&)/i.test(name)) return 'Chers'
  if (/^(famille|madame|mme|mademoiselle|mlle)\b/i.test(name)) return 'Chère'
  return 'Cher'
}

// Personnes qui répondent chacune pour elle-même : la liste `people` si elle est
// donnée, sinon les noms de part et d'autre de « et » / « & »
// (« Emmanuel NOUEMOU et Félicité CHABI » → deux personnes), sinon une seule.
function peopleOf(entry, name) {
  if (Array.isArray(entry?.people) && entry.people.length) return entry.people.map(String)
  const parts = name.split(/\s+(?:et|&)\s+/i).map((p) => p.trim()).filter(Boolean)
  return parts.length > 1 ? parts : [name]
}

// Les clés de config.js peuvent contenir majuscules, accents ou espaces :
// on les compare sous leur forme de lien (« Couple NOUEMOU » → « couple-nouemou »).
const BY_SLUG = new Map(Object.entries(GUESTS).map(([k, entry]) => [slug(k), entry]))

// Seul le lien général (`?i=` égal à LINKS.generalCode) ouvre le faire-part.
// Il n'y a plus de lien personnel : l'invité tape son nom (NameGate), puis
// son invitation est retenue le temps de la visite (sessionStorage).
const rawParam = typeof window === 'undefined' ? '' : slug(new URLSearchParams(window.location.search).get('i') || '')
export const GENERAL = !!LINKS.generalCode && rawParam === slug(LINKS.generalCode)

const SESSION_KEY = 'invitation'

function readKey() {
  if (!GENERAL) return null
  try {
    const k = sessionStorage.getItem(SESSION_KEY)
    return k && BY_SLUG.has(k) ? k : null
  } catch {
    return null
  }
}

// Ouvre l'invitation trouvée par NameGate (recharge la page sur le même lien).
export function openInvitation(key) {
  try {
    sessionStorage.setItem(SESSION_KEY, key)
  } catch {
    /* stockage bloqué : rien à faire */
  }
  window.location.reload()
}

function readGuest(key) {
  if (!key) return null
  const entry = BY_SLUG.get(key)
  const name = typeof entry === 'string' ? entry : entry?.name
  if (!name) return null
  return { name, salutation: entry?.salutation || defaultSalutation(name), people: peopleOf(entry, name) }
}

const key = readKey()
export const GUEST = readGuest(key)
// Clé de l'invitation reconnue (sert aussi de clé dans la feuille Google), ou null.
export const GUEST_KEY = GUEST ? key : null
// false : lien non valide, rien du faire-part n'est affiché.
export const ACCESS_OK = GENERAL
// true : lien général, mais nom pas encore saisi → écran NameGate.
export const NEEDS_NAME = GENERAL && !GUEST

// Toutes les personnes invitées, avec la clé de leur invitation.
const ALL_PEOPLE = [...BY_SLUG.entries()].flatMap(([k, entry]) => {
  const name = typeof entry === 'string' ? entry : entry?.name
  if (!name) return []
  const people = peopleOf(entry, name)
  return people.map((p) => ({ name: p, invitation: k }))
})

const words = (s) => slug(s).split('-').filter(Boolean)

// Retrouve la personne invitée correspondant au nom tapé sur le lien général.
// L'ordre des mots, les accents et les majuscules sont ignorés ; il faut au moins
// deux mots (prénom et nom) et une seule invitation possible.
// Renvoie { person } , { ambiguous: true } ou null si le nom n'est pas sur la liste.
export function findInvited(typed) {
  const t = words(typed)
  if (t.length < 2) return null
  const matches = ALL_PEOPLE.filter((p) => {
    const w = words(p.name)
    return t.every((x) => w.includes(x))
  })
  // Plusieurs noms trouvés mais tous dans la même invitation (un couple) : on ouvre celle-là.
  if (matches.length && matches.every((m) => m.invitation === matches[0].invitation)) return { person: matches[0] }
  return matches.length > 1 ? { ambiguous: true } : null
}
