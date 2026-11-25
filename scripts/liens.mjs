// Affiche le lien d'invitation de chaque invité de src/config.js.
// Utilisation : npm run liens
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slug } from '../src/lib/slug.js'
import { guestParam } from '../src/lib/linkcode.js'

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

const rows = Object.entries(GUESTS).map(([key, entry]) => ({
  name: typeof entry === 'string' ? entry : entry.name,
  link: `${SITE}?i=${guestParam(slug(key), LINKS.secret)}`,
}))

const seen = new Map()
for (const { name, link } of rows) {
  if (seen.has(link)) console.warn(`⚠ Même lien pour « ${seen.get(link)} » et « ${name} » : changez une des deux clés.`)
  seen.set(link, name)
}

for (const { name, link } of rows) console.log(`${name}\n  ${link}\n`)
console.log(`${rows.length} invités`)
if (LINKS.generalCode) console.log(`
Lien général (l'invité tape son nom) :
  ${SITE}?i=${slug(LINKS.generalCode)}`)
if (LINKS.acceptOldLinks) console.log(`
Les anciens liens sans code marchent encore (LINKS.acceptOldLinks dans src/config.js).`)
