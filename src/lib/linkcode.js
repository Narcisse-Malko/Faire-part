// Code ajouté à la fin de chaque lien d'invitation pour qu'on ne puisse pas
// le deviner : « monsieur-gasset » → « monsieur-gasset-k7q2xm ».
// Le code dépend de la clé de l'invité et de LINKS.secret (src/config.js) :
// changer le secret change tous les liens.

// Empreinte cyrb53 (rapide, sans dépendance), suffisante contre les essais au hasard.
function hash(str) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export function linkCode(key, secret) {
  return hash(`${secret}:${key}`).toString(36).padStart(8, '0').slice(-6)
}

// Valeur de `?i=` du lien personnel d'un invité (clé déjà sous forme de lien).
export function guestParam(key, secret) {
  return `${key}-${linkCode(key, secret)}`
}
