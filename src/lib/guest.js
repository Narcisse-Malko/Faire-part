import { GUESTS } from '../config'
import { slug } from './slug'

function defaultSalutation(name) {
  if (/(\s(et)\s|&)/i.test(name)) return 'Chers'
  if (/^(famille|madame|mme|mademoiselle|mlle)\b/i.test(name)) return 'Chère'
  return 'Cher'
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
  return { name, salutation: entry?.salutation || defaultSalutation(name) }
}

const key = readKey()
export const GUEST = readGuest(key)
// Clé du lien (`?i=…`) de l'invité reconnu, ou null.
export const GUEST_KEY = GUEST ? key : null
