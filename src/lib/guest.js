import { GUESTS } from '../config'
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

// Invité désigné par le paramètre `?i=` du lien, ou null s'il est absent ou inconnu.
function readKey() {
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get('i')
  const key = raw ? slug(raw) : ''
  return key && BY_SLUG.has(key) ? key : null
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
// Clé du lien (`?i=…`) de l'invité reconnu, ou null.
export const GUEST_KEY = GUEST ? key : null

// Toutes les personnes invitées, avec la clé sous laquelle leur réponse est
// enregistrée (la même que par leur lien personnel, pour éviter les doublons).
const ALL_PEOPLE = [...BY_SLUG.entries()].flatMap(([k, entry]) => {
  const name = typeof entry === 'string' ? entry : entry?.name
  if (!name) return []
  const people = peopleOf(entry, name)
  return people.map((p) => ({ name: p, key: people.length > 1 ? `${k}/${slug(p)}` : k }))
})

const words = (s) => slug(s).split('-').filter(Boolean)

// Retrouve la personne invitée correspondant au nom tapé sur le lien général.
// L'ordre des mots, les accents et les majuscules sont ignorés ; il faut au moins
// deux mots (prénom et nom) et un seul invité possible.
// Renvoie { person } , { ambiguous: true } ou null si le nom n'est pas sur la liste.
export function findInvited(typed) {
  const t = words(typed)
  if (t.length < 2) return null
  const matches = ALL_PEOPLE.filter((p) => {
    const w = words(p.name)
    return t.every((x) => w.includes(x))
  })
  if (matches.length === 1) return { person: matches[0] }
  return matches.length > 1 ? { ambiguous: true } : null
}
