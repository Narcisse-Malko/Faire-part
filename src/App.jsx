import { useState } from 'react'
import Envelope from './components/Envelope'
import FloralArch from './components/FloralArch'
import ScratchDate from './components/ScratchDate'
import Timeline from './components/Timeline'
import Countdown from './components/Countdown'
import AudioPlayer from './components/AudioPlayer'
import Rsvp from './components/Rsvp'
import WaxSeal from './components/WaxSeal'
import { TataFrieze, TataDivider, ChevronBand } from './components/Tata'
import { useReveal } from './lib/useReveal'
import { COUPLE } from './config'

function Section({ kicker, title, subtitle, children, id }) {
  const ref = useReveal()
  return (
    <section id={id} className="px-6 py-16">
      <div ref={ref} className="reveal">
        <div className="mb-10 text-center">
          {kicker && <p className="font-display text-[0.68rem] tracking-[0.35em] text-gold uppercase">{kicker}</p>}
          <h2 className="mt-2 font-script text-[2.9rem] leading-tight text-gold-foil">{title}</h2>
          {subtitle && <p className="mt-2 font-serif text-lg italic text-ink-soft">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)

  return (
    <>
      {!opened && <Envelope onOpened={() => setOpened(true)} />}
      <AudioPlayer />

      <main className="relative mx-auto min-h-screen max-w-2xl overflow-hidden bg-ivory/70 shadow-[0_0_60px_-20px_rgba(110,80,30,.25)] sm:my-8 sm:rounded-sm sm:ring-1 sm:ring-gold/30">
        <div className="opacity-80">
          <ChevronBand />
        </div>

        {/* 1. En-tête sous l'arche florale */}
        <header className={`px-4 pt-8 pb-4 transition-all duration-1000 ${opened ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <FloralArch />
          <a href="#date" className="mt-6 flex flex-col items-center text-gold" aria-label="Défiler vers la date">
            <span className="font-display text-[0.6rem] tracking-[0.35em] uppercase">Découvrir</span>
            <svg viewBox="0 0 24 24" className="animate-bob mt-1 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9 l6 6 l6 -6" />
            </svg>
          </a>
        </header>

        <TataDivider className="mx-auto max-w-xs" />

        {/* 2. Date à gratter */}
        <Section id="date" kicker="Réservez la date" title="Le jour J" subtitle="Grattez la carte du bout du doigt">
          <ScratchDate />
        </Section>

        <TataDivider className="mx-auto max-w-xs" />

        {/* 3. Programme */}
        <Section kicker="Déroulé de la journée" title="Le programme">
          <Timeline />
        </Section>

        <TataDivider className="mx-auto max-w-xs" />

        {/* 4. Compte à rebours */}
        <Section kicker="Plus que quelques instants" title="Compte à rebours" subtitle="avant de célébrer ensemble">
          <Countdown />
        </Section>

        <TataDivider className="mx-auto max-w-xs" />

        {/* 5. Confirmation de présence */}
        <Section kicker="Répondez s'il vous plaît" title="Serez-vous là ?">
          <Rsvp />
        </Section>

        <footer className="relative pt-4 text-center">
          <WaxSeal className="mx-auto w-20 drop-shadow-[0_4px_6px_rgba(90,60,15,.35)]" />
          <p className="mt-5 px-6 font-serif text-lg italic text-ink-soft text-balance">Nous avons hâte de partager ce moment avec vous</p>
          <p className="mt-2 font-script text-4xl text-gold-foil">
            {COUPLE.groom} &amp; {COUPLE.bride}
          </p>
          <TataFrieze className="mt-10" height={72} />
        </footer>
      </main>
    </>
  )
}
