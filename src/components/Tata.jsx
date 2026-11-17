import { useId } from 'react'

/*
 * Motifs inspirés des Tata somba (Otammari) du nord du Bénin :
 * tours cylindriques en banco coiffées de toits coniques en paille,
 * murs reliant les tours, petites ouvertures et décors gravés en chevrons.
 * Tout est dessiné au trait doré pour rester dans l'esprit luxueux du faire-part.
 */

const GOLD = '#b8913a'
const GOLD_DARK = '#8a6a22'

// Une tour Tata : corps en banco légèrement évasé + toit conique de chaume
export function TataTower({ x, base, w, h, roof, fill = '#f6ecd6', stroke = GOLD, sw = 1 }) {
  const top = base - h
  const apex = top - roof
  const overhang = w * 0.18
  const thatch = []
  const n = 7
  for (let i = 1; i < n; i++) {
    const bx = x - overhang + ((w + overhang * 2) * i) / n
    thatch.push(<line key={i} x1={x + w / 2} y1={apex + 2} x2={bx} y2={top + 2} />)
  }
  return (
    <g stroke={stroke} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
      <path
        d={`M${x - w * 0.06} ${base} L${x + w * 0.06} ${top} L${x + w * 0.94} ${top} L${x + w * 1.06} ${base} Z`}
        fill={fill}
      />
      {/* bourrelet décoratif sous le toit */}
      <line x1={x + w * 0.08} y1={top + h * 0.2} x2={x + w * 0.92} y2={top + h * 0.2} strokeOpacity=".6" />
      {/* petite ouverture */}
      <path
        d={`M${x + w * 0.4} ${top + h * 0.62} h${w * 0.2} v${h * 0.16} h${-w * 0.2} Z`}
        fill={stroke}
        fillOpacity=".35"
      />
      <path d={`M${x - overhang} ${top + 2} L${x + w / 2} ${apex} L${x + w + overhang} ${top + 2} Z`} fill="#efe1bf" />
      <g strokeOpacity=".45" strokeWidth={sw * 0.7}>{thatch}</g>
      <line x1={x + w / 2} y1={apex} x2={x + w / 2} y2={apex - roof * 0.25} />
      <circle cx={x + w / 2} cy={apex - roof * 0.25 - 1.6} r="1.6" fill={stroke} />
    </g>
  )
}

// Frise répétée : tour, mur percé d'une porte, grenier
export function TataFrieze({ className = '', height = 64, flip = false }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 360 ${height}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <defs>
        <pattern id={`tf-${id}`} width="120" height={height} patternUnits="userSpaceOnUse">
          <g transform={`translate(0 ${height - 64})`}>
            {/* mur */}
            <path d="M38 62 V40 H88 V62" fill="#f6ecd6" stroke={GOLD} strokeWidth="1" />
            <path d="M58 62 V52 a5 5 0 0 1 10 0 V62" fill="#e9d8b0" stroke={GOLD} strokeWidth="1" />
            <path d="M42 46 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4" fill="none" stroke={GOLD} strokeWidth=".8" strokeOpacity=".7" />
            <TataTower x={14} base={62} w={26} h={30} roof={20} />
            <TataTower x={88} base={62} w={18} h={20} roof={14} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#tf-${id})`} />
      <line x1="0" y1={height - 1} x2="360" y2={height - 1} stroke={GOLD} strokeWidth="1.2" />
    </svg>
  )
}

// Bande de chevrons et points, comme les décors gravés sur les murs
export function ChevronBand({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} width="100%" height="18" aria-hidden="true">
      <defs>
        <pattern id={`cb-${id}`} width="24" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 11 L6 3 L12 11 L18 3 L24 11" fill="none" stroke={GOLD} strokeWidth="1" />
          <circle cx="6" cy="15" r="1" fill={GOLD} />
          <circle cx="18" cy="15" r="1" fill={GOLD} />
        </pattern>
      </defs>
      <rect width="100%" height="18" fill={`url(#cb-${id})`} />
    </svg>
  )
}

// Séparateur : petite concession Tata au centre, filets dorés de part et d'autre
export function TataDivider({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 300 52" width="100%" height="52" aria-hidden="true">
      <g stroke={GOLD} strokeWidth="1" fill="none">
        <line x1="10" y1="46" x2="112" y2="46" />
        <line x1="188" y1="46" x2="290" y2="46" />
        <path d="M4 46 l6 -4 l6 4 l-6 4 Z" fill={GOLD} />
        <path d="M284 46 l6 -4 l6 4 l-6 4 Z" fill={GOLD} />
        <path d="M118 46 H182" />
      </g>
      <path d="M134 46 V34 H166 V46" fill="#f6ecd6" stroke={GOLD} strokeWidth="1" />
      <path d="M146 46 V40 a4 4 0 0 1 8 0 V46" fill="#e9d8b0" stroke={GOLD} strokeWidth="1" />
      <TataTower x={120} base={46} w={16} h={18} roof={13} />
      <TataTower x={164} base={46} w={16} h={18} roof={13} />
      <circle cx="150" cy="22" r="2" fill={GOLD_DARK} />
    </svg>
  )
}
