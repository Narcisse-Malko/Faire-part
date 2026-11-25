import { useState } from 'react'
import Envelope from './components/Envelope'
import FloralArch from './components/FloralArch'
import ScratchDate from './components/ScratchDate'
import Timeline from './components/Timeline'
import Countdown from './components/Countdown'
import AudioPlayer from './components/AudioPlayer'
import Rsvp from './components/Rsvp'
import DressCode from './components/DressCode'
import WaxSeal from './components/WaxSeal'
import { TataFrieze, TataDivider, ChevronBand } from './components/Tata'
import { useReveal } from './lib/useReveal'
import { COUPLE, DRESS_CODE } from './config'
import { ACCESS_OK, GENERAL } from './lib/guest'
import NameGate from './components/NameGate'
import couplePhoto from './assets/couple.jpg'

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

// Lien sans invitation valide : rien du faire-part (date, lieu, programme) n'est montré.
function InvalidLink() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-8 text-center">
      <WaxSeal className="w-20 drop-shadow-[0_4px_6px_rgba(90,60,15,.35)]" />
      <h1 className="mt-6 font-script text-4xl leading-tight text-gold-foil">Lien non valide</h1>
      <p className="mt-4 max-w-xs font-serif text-lg leading-snug text-ink text-balance">
        Ce lien d’invitation n’est pas reconnu. Merci d’utiliser le lien personnel que vous avez reçu.
      </p>
      <TataDivider className="mt-8 w-full max-w-xs" />
    </main>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)

  if (!ACCESS_OK) return <InvalidLink />
  if (GENERAL) return <NameGate />

  return (
    <>
      {!opened && <Envelope onOpened={() => setOpened(true)} />}
      <AudioPlayer />

      {/*
        Photo des mariés en fond estompé : fixe pendant le défilement, teintée
        dorée et fondue sur les bords. Pour la rendre plus ou moins visible,
        changer opacity ci-dessous (0 = invisible, 1 = nette).
      */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          src={couplePhoto}
          alt=""
          className="absolute left-1/2 top-1/2 h-auto max-w-none"
          style={{
            // largeur choisie pour que les deux visages tiennent dans l'écran, centrés entre eux
            width: 'min(145vw, 1100px)',
            transform: 'translate(-57%, -50%)',
            opacity: 0.4,
            filter: 'sepia(.45) saturate(.75) contrast(.9) blur(.5px)',
            maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto min-h-screen max-w-2xl overflow-hidden bg-ivory/70 shadow-[0_0_60px_-20px_rgba(110,80,30,.25)] sm:my-8 sm:rounded-sm sm:ring-1 sm:ring-gold/30">
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

        {/* 4. Dress code */}
        <Section kicker="Dress code" title={DRESS_CODE.title}>
          <DressCode />
        </Section>

        <TataDivider className="mx-auto max-w-xs" />

        {/* 5. Compte à rebours */}
        <Section kicker="Plus que quelques instants" title="Compte à rebours" subtitle="avant de célébrer ensemble">
          <Countdown />
        </Section>

        <TataDivider className="mx-auto max-w-xs" />

        {/* 6. Confirmation de présence */}
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
