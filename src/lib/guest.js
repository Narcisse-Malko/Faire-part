import { GUESTS } from '../config'

function defaultSalutation(name) {
  if (/(\s(et)\s|&)/i.test(name)) return 'Chers'
  if (/^(famille|madame|mme|mademoiselle|mlle)\b/i.test(name)) return 'Chère'
  return 'Cher'
}

// Invité désigné par le paramètre `?i=` du lien, ou null s'il est absent ou inconnu.
function readKey() {
  if (typeof window === 'undefined') return null
  const key = new URLSearchParams(window.location.search).get('i')?.trim().toLowerCase()
  return key && Object.hasOwn(GUESTS, key) ? key : null
}

function readGuest(key) {
  if (!key) return null
  const entry = GUESTS[key]
  const name = typeof entry === 'string' ? entry : entry?.name
  if (!name) return null
  return { name, salutation: entry?.salutation || defaultSalutation(name) }
}

const key = readKey()
export const GUEST = readGuest(key)
// Clé du lien (`?i=…`) de l'invité reconnu, ou null.
export const GUEST_KEY = GUEST ? key : null
