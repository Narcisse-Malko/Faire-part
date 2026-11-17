import { useMemo } from 'react'
import { TataTower } from './Tata'
import { COUPLE } from '../config'

// Générateur pseudo-aléatoire déterministe : l'arche est identique à chaque rendu
function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CX = 180
const CY = 196
const R = 132
const LEG_L = CX - R
const LEG_R = CX + R
const LEG_END = 372

const PETALS = ['#fffdf7', '#f6e3d6', '#efdcb6', '#fbf1e4']
const LEAVES = ['#b5ad83', '#c8bb8c', '#a29b72']

function Leaf({ x, y, angle, size, color }) {
  return (
    <path
      d="M0 0 Q 7 -4.5 15 0 Q 7 4.5 0 0 Z"
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}
      fill={color}
      stroke="#8a6a22"
      strokeOpacity=".35"
      strokeWidth=".5"
    />
  )
}

function Flower({ x, y, r, color, rot }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={r * 0.55}
          cy="0"
          rx={r * 0.62}
          ry={r * 0.42}
          transform={`rotate(${a})`}
          fill={color}
          stroke="#c9a85a"
          strokeWidth=".6"
        />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <ellipse key={a} cx={r * 0.3} cy="0" rx={r * 0.38} ry={r * 0.26} transform={`rotate(${a})`} fill={color} stroke="#c9a85a" strokeWidth=".4" opacity=".9" />
      ))}
      <circle r={r * 0.24} fill="#d4af55" />
      <circle r={r * 0.1} fill="#8a6a22" />
    </g>
  )
}

// Points répartis le long de l'arche avec la direction de la tangente
function archPoints() {
  const pts = []
  for (let d = 180; d >= 0; d -= 4.5) {
    const a = (d * Math.PI) / 180
    pts.push({ x: CX + R * Math.cos(a), y: CY - R * Math.sin(a), tangent: 90 - d, deg: d, leg: false })
  }
  for (let y = CY + 12; y < 316; y += 14) {
    pts.push({ x: LEG_L, y, tangent: 90, leg: true, side: -1 })
    pts.push({ x: LEG_R, y, tangent: 90, leg: true, side: 1 })
  }
  return pts
}

export default function FloralArch() {
  const { leaves, flowers, dots } = useMemo(() => {
    const rand = rng(8022027)
    const leaves = []
    const flowers = []
    const dots = []
    const pts = archPoints()

    pts.forEach((p, i) => {
      const spread = p.leg ? 0.6 : 1
      for (let k = 0; k < 2; k++) {
        leaves.push({
          key: `l${i}${k}`,
          x: p.x + (rand() - 0.5) * 6,
          y: p.y + (rand() - 0.5) * 6,
          angle: p.tangent + (k ? 1 : -1) * (30 + rand() * 40) + (rand() > 0.5 ? 180 : 0),
          size: (0.75 + rand() * 0.6) * spread + 0.2,
          color: LEAVES[Math.floor(rand() * LEAVES.length)],
        })
      }
      // plus de fleurs au sommet et aux épaules de l'arche
      const dense = !p.leg && (Math.abs(p.deg - 90) < 22 || Math.abs(p.deg - 150) < 14 || Math.abs(p.deg - 30) < 14)
      const chance = p.leg ? (p.y < 250 ? 0.35 : 0.12) : dense ? 0.95 : 0.45
      if (rand() < chance) {
        flowers.push({
          key: `f${i}`,
          x: p.x + (rand() - 0.5) * 10,
          y: p.y + (rand() - 0.5) * 10,
          r: (dense ? 8 : 5.5) + rand() * 4,
          color: PETALS[Math.floor(rand() * PETALS.length)],
          rot: rand() * 72,
        })
      }
      if (rand() < 0.7) {
        dots.push({ key: `d${i}`, x: p.x + (rand() - 0.5) * 22, y: p.y + (rand() - 0.5) * 22, r: 0.9 + rand() * 1.3 })
      }
    })
    // grosses fleurs au faîte
    flowers.push({ key: 'top', x: CX, y: CY - R - 2, r: 15, color: '#fffdf7', rot: 10 })
    flowers.push({ key: 'top-l', x: CX - 22, y: CY - R + 4, r: 10, color: '#f6e3d6', rot: 40 })
    flowers.push({ key: 'top-r', x: CX + 22, y: CY - R + 4, r: 10, color: '#efdcb6', rot: 20 })
    return { leaves, flowers, dots }
  }, [])

  return (
    <div className="relative mx-auto aspect-[360/470] w-full max-w-[420px]">
      <svg viewBox="0 0 360 470" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="arch-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#fbf3e2" />
          </linearGradient>
        </defs>

        {/* fond intérieur de l'arche */}
        <path d={`M${LEG_L + 8} 452 V${CY} A${R - 8} ${R - 8} 0 0 1 ${LEG_R - 8} ${CY} V452 Z`} fill="url(#arch-fill)" />

        {/* double filet doré */}
        <g fill="none" stroke="#b8913a">
          <path d={`M${LEG_L} ${LEG_END} V${CY} A${R} ${R} 0 0 1 ${LEG_R} ${CY} V${LEG_END}`} strokeWidth="1.6" />
          <path d={`M${LEG_L + 8} 452 V${CY} A${R - 8} ${R - 8} 0 0 1 ${LEG_R - 8} ${CY} V452`} strokeWidth=".7" strokeOpacity=".7" />
        </g>

        <g>{leaves.map((l) => <Leaf {...l} key={l.key} />)}</g>
        <g fill="#d4af55">{dots.map((d) => <circle key={d.key} cx={d.x} cy={d.y} r={d.r} />)}</g>
        <g>{flowers.map((f) => <Flower {...f} key={f.key} />)}</g>

        {/* les piliers de l'arche sont deux tours Tata */}
        <TataTower x={LEG_L - 19} base={452} w={38} h={46} roof={34} sw={1.1} />
        <TataTower x={LEG_R - 19} base={452} w={38} h={46} roof={34} sw={1.1} />
        <line x1="10" y1="452" x2="350" y2="452" stroke="#b8913a" strokeWidth="1.2" />
        <path d="M70 460 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4" fill="none" stroke="#b8913a" strokeWidth=".8" strokeOpacity=".7" />
      </svg>

      <div className="absolute inset-x-[15%] top-[31%] bottom-[20%] flex flex-col items-center justify-center text-center">
        <p className="font-display text-[0.62rem] leading-relaxed tracking-[0.3em] text-gold uppercase">
          Avec la bénédiction
          <br />
          de leurs familles
        </p>
        <h1 className="mt-3 font-script leading-[0.95] text-gold-foil">
          <span className="block text-[2.9rem]">{COUPLE.groom}</span>
          <span className="block text-3xl text-gold">&amp;</span>
          <span className="block text-[2.9rem] whitespace-nowrap">{COUPLE.bride}</span>
        </h1>
        <p className="mt-5 font-serif text-[1.05rem] italic leading-snug text-ink-soft">
          ont la joie de vous annoncer
          <br />
          leur mariage
        </p>
      </div>
    </div>
  )
}
