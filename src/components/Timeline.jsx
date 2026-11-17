import { PROGRAM } from '../config'
import { ICONS } from './Icons'
import { useReveal } from '../lib/useReveal'

function Item({ item, index }) {
  const ref = useReveal()
  const right = index % 2 === 1
  return (
    <li
      ref={ref}
      className="reveal relative grid grid-cols-[3.5rem_1fr] items-center gap-4 sm:grid-cols-[1fr_4rem_1fr] sm:gap-6"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className={`hidden sm:block ${right ? '' : 'text-right'}`}>
        {!right && <Content item={item} align="right" />}
      </div>

      <div className="relative z-10 flex h-14 w-14 items-center justify-center justify-self-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[1.5px] shadow-[0_8px_18px_-8px_rgba(110,80,30,.6)]">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-ivory text-gold-dark">
          <span className="block w-7">{ICONS[item.icon]}</span>
        </div>
      </div>

      <div className="sm:hidden">
        <Content item={item} align="left" />
      </div>
      <div className="hidden sm:block">{right && <Content item={item} align="left" />}</div>
    </li>
  )
}

function Content({ item, align }) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <p className="font-display text-lg tracking-[0.12em] text-gold">{item.time}</p>
      <p className="font-serif text-[1.35rem] leading-tight text-ink">{item.title}</p>
    </div>
  )
}

export default function Timeline() {
  return (
    <ol className="relative mx-auto max-w-xl space-y-9">
      {/* fil doré vertical */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-7 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold to-transparent sm:left-1/2"
      />
      {PROGRAM.map((item, i) => (
        <Item key={item.time} item={item} index={i} />
      ))}
    </ol>
  )
}
