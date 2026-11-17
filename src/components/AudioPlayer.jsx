import { useEffect, useRef, useState } from 'react'
import { MUSIC_SRC } from '../config'
import { createAmbient, createFilePlayer } from '../lib/ambient'

/*
 * Lecteur discret : la musique démarre à la première interaction de l'invité
 * (les navigateurs interdisent la lecture automatique sans geste de l'utilisateur).
 * Le bouton en bas à droite permet ensuite de couper ou relancer le son.
 */
export default function AudioPlayer() {
  const player = useRef(null)
  const btn = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  const ensure = () => {
    if (!player.current) player.current = MUSIC_SRC ? createFilePlayer(MUSIC_SRC) : createAmbient()
    return player.current
  }

  const start = async () => {
    try {
      await ensure().play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
    setReady(true)
  }

  useEffect(() => {
    const events = ['click', 'touchend', 'keydown']
    const onFirst = (e) => {
      if (btn.current?.contains(e.target)) return // le bouton gère son propre clic
      events.forEach((ev) => window.removeEventListener(ev, onFirst, true))
      start()
    }
    events.forEach((ev) => window.addEventListener(ev, onFirst, true))
    return () => events.forEach((ev) => window.removeEventListener(ev, onFirst, true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    if (playing) {
      player.current?.pause()
      setPlaying(false)
    } else {
      start()
    }
  }

  return (
    <button
      ref={btn}
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Couper la musique' : 'Lancer la musique'}
      aria-pressed={playing}
      className={`fixed right-4 bottom-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-ivory/85 text-gold-dark shadow-[0_6px_16px_-6px_rgba(110,80,30,.5)] backdrop-blur transition-all duration-500 hover:scale-105 ${
        ready ? 'opacity-100' : 'opacity-70'
      }`}
    >
      {playing ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
          {[0, 0.25, 0.5, 0.15].map((d, i) => (
            <span key={i} className="eq-bar block h-4 w-[3px] rounded-full bg-gold" style={{ animationDelay: `${d}s` }} />
          ))}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M9 18 V5 l10 -2 v13" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
          <path d="M3 3 L21 21" strokeOpacity=".7" />
        </svg>
      )}
    </button>
  )
}
