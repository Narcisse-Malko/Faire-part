/*
 * Musique d'ambiance générée en direct avec la Web Audio API :
 * nappe douce, basse légère et arpège façon boîte à musique, le tout
 * passé dans une réverbération. Aucun fichier audio n'est nécessaire.
 */

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)

// Ré majeur : Dmaj7 · Bm7 · Gmaj7 · Asus4/A
const CHORDS = [
  [50, 62, 66, 69, 73],
  [47, 62, 66, 69, 71],
  [43, 59, 62, 66, 71],
  [45, 61, 64, 69, 71],
]
const ARP = [1, 2, 3, 4, 3, 2, 3, 1]
const BAR = 5.2
const STEP = BAR / ARP.length

function impulse(ctx, seconds = 3.6, decay = 2.6) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

export function createAmbient() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  const ctx = new Ctx()

  const master = ctx.createGain()
  master.gain.value = 0
  const bus = ctx.createGain()
  const dry = ctx.createGain()
  dry.gain.value = 0.55
  const wet = ctx.createGain()
  wet.gain.value = 0.6
  const verb = ctx.createConvolver()
  verb.buffer = impulse(ctx)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 3200

  bus.connect(dry).connect(lp)
  bus.connect(verb).connect(wet).connect(lp)
  lp.connect(master).connect(ctx.destination)

  let bar = 0
  let nextBar = 0
  let timer = null

  const tone = (freq, t, dur, peak, type, attack, release = dur) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + release)
    o.connect(g).connect(bus)
    o.start(t)
    o.stop(t + release + 0.1)
  }

  const scheduleBar = (t) => {
    const chord = CHORDS[bar % CHORDS.length]
    // basse
    tone(midi(chord[0]), t, BAR, 0.07, 'sine', 0.8, BAR + 1)
    // nappe
    chord.slice(1, 4).forEach((n, i) => {
      tone(midi(n), t, BAR, 0.022, 'sine', 1.8 + i * 0.2, BAR + 1.6)
      tone(midi(n) * 1.003, t, BAR, 0.01, 'triangle', 2, BAR + 1.6)
    })
    // arpège cristallin
    ARP.forEach((idx, i) => {
      if (i > 0 && Math.random() < 0.15) return
      const f = midi(chord[idx] + 12)
      const st = t + i * STEP + (Math.random() - 0.5) * 0.02
      tone(f, st, 2, 0.045, 'triangle', 0.008, 2.2)
      tone(f * 2, st, 1, 0.012, 'sine', 0.005, 1.1)
    })
    bar++
  }

  const loop = () => {
    while (nextBar < ctx.currentTime + 1.2) {
      scheduleBar(nextBar)
      nextBar += BAR
    }
  }

  const fadeTo = (v, s) => {
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(v, now + s)
  }

  return {
    async play() {
      await ctx.resume()
      if (!timer) {
        nextBar = Math.max(nextBar, ctx.currentTime + 0.1)
        loop()
        timer = setInterval(loop, 300)
      }
      fadeTo(0.85, 2.5)
    },
    pause() {
      fadeTo(0, 0.6)
      setTimeout(() => {
        clearInterval(timer)
        timer = null
        ctx.suspend()
      }, 650)
    },
  }
}

// Même interface pour un vrai fichier audio
export function createFilePlayer(src) {
  const audio = new Audio(src)
  audio.loop = true
  audio.volume = 0
  let raf
  const fade = (to, ms, done) => {
    cancelAnimationFrame(raf)
    const from = audio.volume
    const t0 = performance.now()
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms)
      audio.volume = from + (to - from) * k
      if (k < 1) raf = requestAnimationFrame(step)
      else done?.()
    }
    raf = requestAnimationFrame(step)
  }
  return {
    async play() {
      await audio.play()
      fade(0.6, 2000)
    },
    pause() {
      fade(0, 600, () => audio.pause())
    },
  }
}
