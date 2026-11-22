import { GUESTS } from '../config'

function defaultSalutation(name) {
  if (/(\s(et)\s|&)/i.test(name)) return 'Chers'
  if (/^(famille|madame|mme|mademoiselle|mlle)\b/i.test(name)) return 'Chère'
  return 'Cher'
}

// Invité désigné par le paramètre `?i=` du lien, ou null s'il est absent ou inconnu.
function readGuest() {
  if (typeof window === 'undefined') return null
  const key = new URLSearchParams(window.location.search).get('i')?.trim().toLowerCase()
  if (!key || !Object.hasOwn(GUESTS, key)) return null
  const entry = GUESTS[key]
  const name = typeof entry === 'string' ? entry : entry?.name
  if (!name) return null
  return { name, salutation: entry?.salutation || defaultSalutation(name) }
}

export const GUEST = readGuest()
