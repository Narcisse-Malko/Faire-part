import { DRESS_CODE } from '../config'

/*
 * Silhouettes de mode dessinées au trait doré, vêtues de blanc :
 * une femme en robe longue coiffée d'un gélé, un homme en boubou brodé.
 * Visages sans traits, à la manière d'une illustration de mode.
 */

const SKIN = '#6b4428'
const SKIN_SHADE = '#583720'
const HAIR = '#2a1c10'
const WHITE = '#fffdf8'
const LINE = '#b8913a'

function Woman() {
  return (
    <svg viewBox="0 0 140 320" className="h-full w-auto" style={{ aspectRatio: "140 / 320" }} role="img" aria-label="Femme en robe longue blanche et gélé blanc">
      <defs>
        <linearGradient id="dc-dress" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#efe6d3" />
          <stop offset=".35" stopColor={WHITE} />
          <stop offset=".7" stopColor={WHITE} />
          <stop offset="1" stopColor="#eadfc8" />
        </linearGradient>
      </defs>

      {/* bras */}
      <g stroke={SKIN} strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M52 76 Q41 108 44 140" />
        <path d="M88 76 Q99 108 96 140" />
      </g>
      <circle cx="44" cy="143" r="4.6" fill={SKIN} />
      <circle cx="96" cy="143" r="4.6" fill={SKIN} />

      {/* cou et tête */}
      <path d="M64 54 h12 v16 h-12 Z" fill={SKIN_SHADE} />
      <ellipse cx="70" cy="44" rx="12" ry="14" fill={SKIN} />

      {/* gélé : grand foulard noué en éventail */}
      <g fill={WHITE} stroke={LINE} strokeWidth="1.1" strokeLinejoin="round">
        <path d="M55 42 Q52 22 70 18 Q88 22 85 42 Q78 34 70 34 Q62 34 55 42 Z" />
        <path d="M60 22 Q50 6 62 2 Q70 12 70 18 Z" />
        <path d="M80 22 Q92 4 100 12 Q92 20 84 26 Z" />
        <path d="M66 18 Q72 0 86 4 Q80 14 76 20 Z" />
      </g>
      <g stroke={LINE} strokeWidth=".6" strokeOpacity=".6" fill="none">
        <path d="M58 32 Q70 26 82 32" />
        <path d="M63 10 Q66 15 68 18" />
        <path d="M90 10 Q86 16 82 22" />
      </g>
      <circle cx="58" cy="50" r="1.6" fill="#d9b55c" />

      {/* robe : corsage ajusté, jupe longue évasée */}
      <path
        d="M52 72 Q70 80 88 72 L86 112 Q84 120 86 126 Q110 210 122 300 Q96 312 70 310 Q44 312 18 300 Q30 210 54 126 Q56 120 54 112 Z"
        fill="url(#dc-dress)"
        stroke={LINE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* drapés */}
      <g stroke={LINE} strokeWidth=".7" strokeOpacity=".45" fill="none" strokeLinecap="round">
        <path d="M62 128 Q56 210 44 304" />
        <path d="M70 130 Q70 220 70 309" />
        <path d="M78 128 Q84 210 96 304" />
        <path d="M58 78 Q70 92 82 78" />
      </g>
      {/* ceinture dorée */}
      <path d="M54 114 Q70 121 86 114 L86 122 Q70 129 54 122 Z" fill="#d9b55c" stroke="#8a6a22" strokeWidth=".6" />
      <path d="M66 117 l4 -4 l4 4 l-4 4 Z" fill="#f6e2a0" stroke="#8a6a22" strokeWidth=".5" />
    </svg>
  )
}

function Man() {
  return (
    <svg viewBox="0 0 140 320" className="h-full w-auto" style={{ aspectRatio: "140 / 320" }} role="img" aria-label="Homme en boubou blanc brodé d'or">
      <defs>
        <linearGradient id="dc-robe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ece2cd" />
          <stop offset=".35" stopColor={WHITE} />
          <stop offset=".7" stopColor={WHITE} />
          <stop offset="1" stopColor="#e8dcc3" />
        </linearGradient>
      </defs>

      {/* pantalon */}
      <g fill={WHITE} stroke={LINE} strokeWidth="1.1" strokeLinejoin="round">
        <path d="M50 230 L48 300 L66 300 L69 230 Z" />
        <path d="M71 230 L74 300 L92 300 L90 230 Z" />
      </g>
      {/* babouches */}
      <path d="M44 300 Q46 308 68 308 L68 300 Z" fill="#a87d2b" />
      <path d="M72 300 L72 308 Q94 308 96 300 Z" fill="#a87d2b" />

      {/* cou et tête */}
      <path d="M63 50 h14 v16 h-14 Z" fill={SKIN_SHADE} />
      <ellipse cx="70" cy="38" rx="13" ry="15" fill={SKIN} />
      <path d="M57 34 Q57 20 70 20 Q83 20 83 34 Q78 26 70 26 Q62 26 57 34 Z" fill={HAIR} />
      {/* toque (kufi) blanche */}
      <path d="M57 28 Q57 14 70 13 Q83 14 83 28 Q70 23 57 28 Z" fill={WHITE} stroke={LINE} strokeWidth="1" />
      <path d="M59 24 Q70 20 81 24" stroke={LINE} strokeWidth=".6" strokeOpacity=".7" fill="none" />

      {/* boubou : grande tunique aux manches amples */}
      <path
        d="M54 64 Q70 72 86 64 L112 82 Q122 120 120 160 L104 162 L100 118 L98 236 Q70 244 42 236 L40 118 L36 162 L20 160 Q18 120 28 82 Z"
        fill="url(#dc-robe)"
        stroke={LINE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* mains */}
      <circle cx="28" cy="166" r="5" fill={SKIN} />
      <circle cx="112" cy="166" r="5" fill={SKIN} />

      {/* broderie dorée : plastron et triangles Tata */}
      <g fill="none" stroke="#b8913a" strokeWidth="1" strokeLinejoin="round">
        <path d="M58 68 L70 110 L82 68" />
        <path d="M62 70 L70 100 L78 70" strokeOpacity=".6" />
        <path d="M70 110 V170" strokeOpacity=".6" />
      </g>
      <g fill="#d9b55c" fillOpacity=".85">
        <path d="M66 118 l4 -6 l4 6 Z" />
        <path d="M66 132 l4 -6 l4 6 Z" />
        <path d="M66 146 l4 -6 l4 6 Z" />
      </g>
      <g stroke={LINE} strokeWidth=".7" strokeOpacity=".45" fill="none" strokeLinecap="round">
        <path d="M50 120 Q48 180 50 234" />
        <path d="M90 120 Q92 180 90 234" />
        <path d="M30 100 Q34 130 32 158" />
        <path d="M110 100 Q106 130 108 158" />
      </g>
    </svg>
  )
}

function Figure({ children, caption }) {
  return (
    <figure className="flex flex-col items-center">
      <div className="relative flex h-64 items-end justify-center sm:h-72">
        {/* halo doré derrière la silhouette */}
        <div className="absolute inset-x-[-10%] bottom-2 top-8 rounded-full bg-[radial-gradient(closest-side,rgba(228,201,126,.35),transparent)]" aria-hidden="true" />
        <div className="relative h-full">{children}</div>
      </div>
      <div className="mt-2 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <figcaption className="mt-3 max-w-[11rem] text-center font-serif text-base italic leading-snug text-ink-soft text-balance">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function DressCode() {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="font-serif text-lg leading-snug text-ink text-balance">{DRESS_CODE.text}</p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Figure caption={DRESS_CODE.women}>
          <Woman />
        </Figure>
        <Figure caption={DRESS_CODE.men}>
          <Man />
        </Figure>
      </div>

      {DRESS_CODE.shades?.length > 0 && (
        <div className="mt-10 flex justify-center gap-6">
          {DRESS_CODE.shades.map((name, i) => (
            <div key={name} className="flex flex-col items-center">
              <span
                className="h-10 w-10 rounded-full shadow-[0_4px_10px_-4px_rgba(110,80,30,.5)] ring-1 ring-gold/60 ring-offset-2 ring-offset-cream"
                style={{ background: ['#ffffff', '#fffaf0', '#f6ecd6'][i] ?? '#ffffff' }}
              />
              <span className="mt-2 font-display text-[0.6rem] tracking-[0.25em] text-gold uppercase">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
