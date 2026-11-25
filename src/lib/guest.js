import { GUESTS, LINKS } from '../config'
import { slug } from './slug'
import { guestParam } from './linkcode'

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

// Valeur de `?i=` attendue pour chaque invité → sa clé
const BY_PARAM = new Map([...BY_SLUG.keys()].map((k) => [guestParam(k, LINKS.secret), k]))

const rawParam = typeof window === 'undefined' ? '' : slug(new URLSearchParams(window.location.search).get('i') || '')

// Invité désigné par le paramètre `?i=` du lien, ou null s'il est absent, inconnu
// ou sans le bon code.
function readKey() {
  if (!rawParam) return null
  if (BY_PARAM.has(rawParam)) return BY_PARAM.get(rawParam)
  return LINKS.acceptOldLinks && BY_SLUG.has(rawParam) ? rawParam : null
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
// Lien général (l'invité tape son nom) : `?i=` égal à LINKS.generalCode.
export const GENERAL = !GUEST && !!LINKS.generalCode && rawParam === slug(LINKS.generalCode)
// false : lien non valide, le contenu du faire-part n'est pas affiché.
export const ACCESS_OK = !!GUEST || GENERAL

// Toutes les personnes invitées, avec la valeur `?i=` de leur invitation.
const ALL_PEOPLE = [...BY_SLUG.entries()].flatMap(([k, entry]) => {
  const name = typeof entry === 'string' ? entry : entry?.name
  if (!name) return []
  const people = peopleOf(entry, name)
  return people.map((p) => ({ name: p, link: guestParam(k, LINKS.secret) }))
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
  if (matches.length && matches.every((m) => m.link === matches[0].link)) return { person: matches[0] }
  return matches.length > 1 ? { ambiguous: true } : null
}
