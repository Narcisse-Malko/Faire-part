// Affiche le lien d'invitation unique (lien général) et la liste des invités
// qui pourront l'ouvrir en tapant leur nom.
// Utilisation : npm run liens
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slug } from '../src/lib/slug.js'

const SITE = 'https://narcisse-malko.github.io/Faire-part/'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// config.js importe la musique, que Node ne sait pas charger : on retire ces lignes.
const source = readFileSync(join(root, 'src/config.js'), 'utf8')
  .split('\n')
  .filter((line) => !/^import .*assets\//.test(line) && !/\bmusique\b/.test(line))
  .join('\n')
const dir = mkdtempSync(join(tmpdir(), 'liens-'))
const file = join(dir, 'config.mjs')
writeFileSync(file, source)
const { GUESTS, LINKS } = await import(pathToFileURL(file).href)
rmSync(dir, { recursive: true, force: true })

const seen = new Map()
for (const [key, entry] of Object.entries(GUESTS)) {
  const name = typeof entry === 'string' ? entry : entry.name
  const k = slug(key)
  if (seen.has(k)) console.warn(`⚠ Même clé pour « ${seen.get(k)} » et « ${name} » : changez une des deux.`)
  seen.set(k, name)
  console.log(`- ${name}`)
}
console.log(`\n${seen.size} invitations\n\nLien à envoyer à tous les invités :\n  ${SITE}?i=${slug(LINKS.generalCode)}`)
