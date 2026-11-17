import { COUPLE } from '../config'

// Contour irrégulier de la cire, calculé une seule fois
const BLOB = (() => {
  const pts = []
  const N = 120
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const r =
      51 +
      2.6 * Math.sin(5 * a + 0.4) +
      1.6 * Math.sin(9 * a + 1.3) +
      1.1 * Math.sin(17 * a + 2.1) +
      (Math.abs(Math.sin(3 * a + 0.9)) > 0.97 ? 3 : 0)
    pts.push(`${(60 + r * Math.cos(a)).toFixed(2)},${(60 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join(' L')} Z`
})()

// Petits triangles gravés en couronne (rappel des décors Tata)
const RING = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2
  const r = 33.5
  const x = 60 + r * Math.cos(a)
  const y = 60 + r * Math.sin(a)
  const deg = (a * 180) / Math.PI + 90
  return (
    <path
      key={i}
      d="M-1.8 1.4 L0 -1.8 L1.8 1.4 Z"
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(1)})`}
    />
  )
})

export default function WaxSeal({ className = '' }) {
  const [a, b] = COUPLE.initials
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`Sceau ${a} & ${b}`}>
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f6e2a0" />
          <stop offset=".35" stopColor="#d9b55c" />
          <stop offset=".75" stopColor="#a87d2b" />
          <stop offset="1" stopColor="#6f501a" />
        </radialGradient>
        <radialGradient id="wax-inner" cx="60%" cy="65%" r="70%">
          <stop offset="0" stopColor="#e6c873" />
          <stop offset=".7" stopColor="#c49a45" />
          <stop offset="1" stopColor="#9b7429" />
        </radialGradient>
        <radialGradient id="sheen" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d={BLOB} fill="url(#wax)" />
      <path d={BLOB} fill="none" stroke="#6f501a" strokeOpacity=".35" strokeWidth="1" />

      {/* empreinte du cachet */}
      <circle cx="60" cy="60" r="40.5" fill="none" stroke="#f7e6ae" strokeOpacity=".65" strokeWidth="1.6" />
      <circle cx="60" cy="60" r="38.5" fill="url(#wax-inner)" stroke="#7d5c1f" strokeOpacity=".55" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="29" fill="none" stroke="#7d5c1f" strokeOpacity=".45" strokeWidth=".8" />
      <g fill="#7d5c1f" fillOpacity=".55">{RING}</g>

      {/* monogramme en relief : ombre, lumière, puis lettre */}
      <g fontFamily="'Great Vibes', cursive" textAnchor="middle">
        {[
          { dx: 0.9, dy: 1.1, fill: '#6f501a', op: 0.7 },
          { dx: -0.6, dy: -0.6, fill: '#fff4cf', op: 0.8 },
          { dx: 0, dy: 0, fill: '#d2ad58', op: 1 },
        ].map((l, i) => (
          <g key={i} transform={`translate(${l.dx} ${l.dy})`} fill={l.fill} fillOpacity={l.op}>
            <text x="42" y="70" fontSize="28">{a}</text>
            <text x="60.5" y="67" fontSize="12">&amp;</text>
            <text x="79" y="70" fontSize="28">{b}</text>
          </g>
        ))}
      </g>

      <ellipse cx="44" cy="36" rx="20" ry="11" fill="url(#sheen)" transform="rotate(-30 44 36)" />
    </svg>
  )
}
