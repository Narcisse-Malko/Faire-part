// Icônes au trait pour la timeline (couleur héritée de currentColor)
const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const ICONS = {
  // accueil : l'entrée d'une concession Tata
  welcome: (
    <svg viewBox="0 0 32 32" {...common}>
      <path d="M5 27 V16 H27 V27" />
      <path d="M13 27 v-5 a3 3 0 0 1 6 0 v5" />
      <path d="M3 17 L9 7 L15 17" />
      <path d="M17 17 L23 7 L29 17" />
      <path d="M9 7 V5 M23 7 V5" />
      <path d="M2 27 H30" />
    </svg>
  ),
  rings: (
    <svg viewBox="0 0 32 32" {...common}>
      <circle cx="12" cy="19" r="7" />
      <circle cx="20" cy="19" r="7" />
      <path d="M9.5 7 L12 4 L14.5 7 L12 10 Z" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 32 32" {...common}>
      <path d="M4 11 h5 l2 -3 h10 l2 3 h5 v14 H4 Z" />
      <circle cx="16" cy="17.5" r="5" />
      <circle cx="16" cy="17.5" r="2" />
      <path d="M24 13.5 h1.5" />
    </svg>
  ),
  glasses: (
    <svg viewBox="0 0 32 32" {...common}>
      <path d="M7 6 h7 l-1 7 a2.5 2.5 0 0 1 -5 0 Z" transform="rotate(-12 10.5 12)" />
      <path d="M18 6 h7 l-1 7 a2.5 2.5 0 0 1 -5 0 Z" transform="rotate(12 21.5 12)" />
      <path d="M11.5 17 L10.5 26 M8 26.5 h5" />
      <path d="M20.5 17 L21.5 26 M19 26.5 h5" />
      <path d="M16 3 v2 M13 4 l1 1.5 M19 4 l-1 1.5" />
    </svg>
  ),
  car: (
    <svg viewBox="0 0 32 32" {...common}>
      <path d="M3 21 v-4 l3 -1 l3 -5 h10 l4 5 l5 1 v4 Z" />
      <circle cx="9" cy="22" r="2.5" />
      <circle cx="23" cy="22" r="2.5" />
      <path d="M12 11 v5 M3 17 h25" />
      <path d="M27 9 c-1.5 -2 -4 -.5 -2 2 l2 1.5 l2 -1.5 c2 -2.5 -.5 -4 -2 -2 Z" />
    </svg>
  ),
}
