// Mot entièrement en majuscules (nom de famille), à écrire en capitales plutôt qu'en calligraphie
export function isCaps(word) {
  return /\p{L}{2,}/u.test(word) && word === word.toUpperCase()
}

// Nom affiché dans une police calligraphiée : les mots en MAJUSCULES passent
// en capitales Cinzel, plus petites et espacées, pour rester lisibles.
export function ScriptName({ text, capsClassName = 'font-display text-gold-dark' }) {
  return text.split(/(\s+)/).map((word, i) =>
    isCaps(word) ? (
      <span key={i} className={capsClassName} style={{ fontSize: '0.5em', letterSpacing: '0.14em' }}>
        {word}
      </span>
    ) : (
      word
    ),
  )
}
