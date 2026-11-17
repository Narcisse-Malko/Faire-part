import { useEffect, useRef, useState } from 'react'
import { DATE_LABEL } from '../config'

const THRESHOLD = 0.45 // part de surface grattée avant révélation complète
const BRUSH = 34

// Couche dorée à gratter, ornée d'une trame de triangles
function paintCover(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#a98330')
  g.addColorStop(0.25, '#e4c97e')
  g.addColorStop(0.5, '#c9a048')
  g.addColorStop(0.75, '#f0d891')
  g.addColorStop(1, '#a98330')
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = 'rgba(255,248,220,.35)'
  ctx.lineWidth = 1
  const s = 22
  for (let y = 0; y < h + s; y += s) {
    ctx.beginPath()
    for (let x = -s; x < w + s; x += s) {
      ctx.lineTo(x, y)
      ctx.lineTo(x + s / 2, y - s * 0.7)
    }
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(90,62,16,.75)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `500 ${Math.round(h * 0.11)}px Cinzel, serif`
  ctx.fillText('GRATTEZ ICI', w / 2, h / 2 - h * 0.06)
  ctx.font = `italic ${Math.round(h * 0.1)}px "Cormorant Garamond", serif`
  ctx.fillText('pour découvrir la date', w / 2, h / 2 + h * 0.1)
}

function Confetti() {
  const bits = Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2 + Math.random() * 0.3
    const d = 90 + Math.random() * 120
    return {
      i,
      dx: `${Math.cos(a) * d}px`,
      dy: `${Math.sin(a) * d - 30}px`,
      rot: `${Math.random() * 540 - 270}deg`,
      size: 4 + Math.random() * 6,
      shape: i % 3,
      color: ['#d4af55', '#f3dc94', '#b8913a', '#fffdf7'][i % 4],
      delay: Math.random() * 0.15,
    }
  })
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.i}
          className="confetti"
          style={{
            '--dx': b.dx,
            '--dy': b.dy,
            '--rot': b.rot,
            width: b.size,
            height: b.shape === 2 ? b.size * 0.5 : b.size,
            background: b.color,
            borderRadius: b.shape === 0 ? '50%' : 2,
            clipPath: b.shape === 1 ? 'polygon(50% 0, 100% 100%, 0 100%)' : undefined,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function ScratchDate() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const moves = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const setup = () => {
      if (revealed) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = wrap.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintCover(ctx, width, height)
    }
    setup()
    // on repeint une fois les polices chargées pour un texte net
    document.fonts?.ready.then(() => !started && setup())
    const ro = new ResizeObserver(() => !started && setup())
    ro.observe(wrap)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const scratch = (p) => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = BRUSH
    ctx.beginPath()
    const from = last.current || p
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(p.x + 0.01, p.y + 0.01)
    ctx.stroke()
    last.current = p
  }

  const checkProgress = () => {
    const c = canvasRef.current
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++
      if (data[i] < 40) clear++
    }
    if (clear / total > THRESHOLD) {
      setRevealed(true)
      navigator.vibrate?.(30)
    }
  }

  const onDown = (e) => {
    if (revealed) return
    drawing.current = true
    setStarted(true)
    canvasRef.current.setPointerCapture?.(e.pointerId)
    last.current = null
    scratch(pos(e))
  }
  const onMove = (e) => {
    if (!drawing.current || revealed) return
    scratch(pos(e))
    if (++moves.current % 12 === 0) checkProgress()
  }
  const onUp = () => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    checkProgress()
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-[6px] bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[1.5px] shadow-[0_20px_40px_-20px_rgba(110,80,30,.5)]">
        <div ref={wrapRef} className="relative aspect-[5/3.5] overflow-hidden rounded-[5px] bg-ivory">
          {/* date cachée */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-3 rounded-[3px] border border-gold/40" />
            <p className="font-display text-[0.65rem] tracking-[0.35em] text-gold uppercase">Le grand jour</p>
            <p className="mt-1 font-display text-[2.1rem] tracking-[0.08em] text-gold-foil">{DATE_LABEL.short}</p>
            <p className="mt-1 font-serif text-xl italic text-ink-soft">{DATE_LABEL.long}</p>
            <div className="mt-3 flex items-center gap-2 text-gold-dark">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M12 21 c-4 -5 -7 -8.5 -7 -12 a7 7 0 0 1 14 0 c0 3.5 -3 7 -7 12 Z" />
                <circle cx="12" cy="9" r="2.4" />
              </svg>
              <p className="font-display text-[0.72rem] tracking-[0.14em] uppercase">{DATE_LABEL.place}</p>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full touch-none select-none transition-opacity duration-700 ${
              revealed ? 'pointer-events-none opacity-0' : 'cursor-grab opacity-100'
            }`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
            aria-label="Zone à gratter révélant la date du mariage"
            role="img"
          />

          {!started && (
            <svg viewBox="0 0 40 40" className="animate-hand pointer-events-none absolute right-[14%] bottom-[12%] w-10 opacity-80" aria-hidden="true">
              <path
                d="M15 34 c-4 -3 -8 -9 -8 -12 c0 -2 2 -3 4 -1 l3 3 V9 a2.5 2.5 0 0 1 5 0 v9 V16 a2.5 2.5 0 0 1 5 0 v3 a2.5 2.5 0 0 1 5 0 v2 a2.5 2.5 0 0 1 5 0 v6 c0 4 -2 7 -5 7 Z"
                fill="#fffdf8"
                stroke="#6f501a"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {revealed && <Confetti />}
      <p className={`mt-5 text-center font-serif text-lg italic text-ink-soft transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        Notez-la vite dans votre agenda !
      </p>
    </div>
  )
}
