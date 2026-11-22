import { DRESS_CODE } from '../config'
import photo from '../assets/dress-code.jpg'

function Suggestion({ label, text }) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-[0.62rem] tracking-[0.3em] text-gold uppercase">{label}</p>
      <div className="mt-2 h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="mt-2 max-w-[11rem] font-serif text-base italic leading-snug text-ink-soft text-balance">{text}</p>
    </div>
  )
}

export default function DressCode() {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="font-serif text-lg leading-snug text-ink text-balance">{DRESS_CODE.text}</p>

      {/* photo dans un cadre doré à double filet */}
      <figure className="relative mx-auto mt-8 rounded-[6px] bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[2px] shadow-[0_18px_36px_-16px_rgba(90,60,15,.55)]">
        <div className="rounded-[5px] bg-ivory p-1.5">
          <div className="relative overflow-hidden rounded-[3px] ring-1 ring-gold/50">
            <img
              src={photo}
              alt="Invités tout de blanc vêtus lors d'une réception en plein air"
              width="1376"
              height="768"
              loading="lazy"
              className="block h-auto w-full"
            />
            {/* léger voile doré pour fondre la photo dans la palette du faire-part */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#6f501a]/20 via-transparent to-[#f6e2a0]/10 mix-blend-multiply" />
          </div>
        </div>
      </figure>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Suggestion label="Mesdames" text={DRESS_CODE.women} />
        <Suggestion label="Messieurs" text={DRESS_CODE.men} />
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
