import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Pointer, Search } from 'lucide-react'
import { citiesOf, getDestination, regions } from '@/data/destinations'
import { themes } from '@/data/themes'
import { heroBanner } from '@/data/home'
import { tours } from '@/data/tours'
import { DURATION_BUCKETS } from '@/lib/tourFilters'
import { fmt, useI18n } from '@/i18n'
import { ButtonLink } from '../ui/Button'
import Img from '../ui/Img'
import HeroMedia from './HeroMedia'
import { HERO_UNDER_HEADER, useHeaderOverlay } from '@/lib/headerOverlay'

const SLIDE_MS = 6000
/** Card-to-background zoom: duration of the grow, and of the fade that hands over to the real background. */
const ZOOM_MS = 1000
const HANDOVER_MS = 500
const EASE = 'cubic-bezier(0.65,0,0.35,1)'

type Box = { top: number; left: number; width: number; height: number }
/** The card photo growing from its place in the row to fill the hero. */
type Zoom = { id: number; bg: string; thumb: string; from: Box; grown: boolean; leaving: boolean }

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Full-bleed hero (content from the homepage banner record) with keyword + destination tour search.
 * The opening video loops on the brand slide. A row of destination cards sits on the right. Picking one (and
 * after that, the 6 s auto-advance) fades the text out, grows that card's photo from its place in the row until it fills the hero,
 * hands over to the full-size background, and only then brings in the destination's text. Meanwhile the
 * row slides left so the cards after it come next.
 */
export default function HomeHero() {
  const { t, l, to } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [dest, setDest] = useState('')
  const [duration, setDuration] = useState('')
  const [theme, setTheme] = useState('')
  const b = heroBanner
  const cards = b.cards.flatMap(({ slug, bg, card }) => {
    const d = getDestination(slug)
    return d ? [{ d, bg, card }] : []
  })
  const n = cards.length
  // The card row is a track of the cards repeated three times; `pos` is the index of its first visible card.
  // The card just before `pos` is the active one. `started` stays false on the brand slide (video + price).
  const [pos, setPos] = useState(0)
  const [started, setStarted] = useState(false)
  const [snap, setSnap] = useState(false)
  const [hover, setHover] = useState(false)
  const active = started ? (((pos - 1) % n) + n) % n : null
  const cur = active == null ? null : cards[active]
  const track = [...cards, ...cards, ...cards]

  // Text on the left follows `cur` only once the zoom has finished; `textOut` fades the old text away first.
  const [txt, setTxt] = useState<typeof cur>(null)
  const [textOut, setTextOut] = useState(false)
  const [zoom, setZoom] = useState<Zoom | null>(null)
  const [readyBg, setReadyBg] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])

  const zoomId = useRef(0)
  const textTimer = useRef<number | undefined>(undefined)

  // Never blocks: a click during a running zoom simply starts a new one from the clicked card.
  const go = (j: number) => {
    if (n === 0) return
    window.clearTimeout(textTimer.current)
    const next = cards[j % n]
    const el = cardRefs.current[j]
    const box = sectionRef.current?.getBoundingClientRect()
    setStarted(true)
    setPos(j + 1)
    if (!el || !box || reduceMotion()) {
      setTxt(next)
      return
    }
    const r = el.getBoundingClientRect()
    const id = ++zoomId.current
    setTextOut(true)
    setZoom({ id, bg: next.bg, thumb: next.card, from: { top: r.top - box.top, left: r.left - box.left, width: r.width, height: r.height }, grown: false, leaving: false })
    // Two frames so the start box is painted before it transitions to full size.
    requestAnimationFrame(() => requestAnimationFrame(() => setZoom((z) => (z?.id === id ? { ...z, grown: true } : z))))
    textTimer.current = window.setTimeout(() => {
      setTxt(next)
      setTextOut(false)
    }, ZOOM_MS)
  }

  // Once grown and the real background underneath shows the same photo, fade the zoom layer out.
  useEffect(() => {
    if (!zoom?.grown || zoom.leaving || readyBg !== zoom.bg) return
    const id = window.setTimeout(() => setZoom((z) => z && { ...z, leaving: true }), 100)
    return () => window.clearTimeout(id)
  }, [zoom, readyBg])
  useEffect(() => {
    if (!zoom?.leaving) return
    const id = window.setTimeout(() => setZoom(null), HANDOVER_MS)
    return () => window.clearTimeout(id)
  }, [zoom?.leaving])

  // After sliding past the first copy, jump back by one copy without animation (it looks identical).
  const onTrackEnd = () => {
    if (pos > n) {
      setSnap(true)
      setPos((p) => p - n)
    }
  }
  // Reduced motion: the track doesn't animate, so no transitionend fires; jump back straight away.
  useEffect(() => {
    if (pos > n && window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPos((p) => p - n)
  }, [pos, n])
  useEffect(() => {
    if (!snap) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)))
    return () => cancelAnimationFrame(id)
  }, [snap])

  // Auto-advance once a destination has been picked: zoom the first card in the row (always the next destination).
  const goRef = useRef(go)
  goRef.current = go
  useEffect(() => {
    if (!started || hover || zoom || n < 2 || reduceMotion()) return
    const id = window.setTimeout(() => goRef.current(pos), SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [started, hover, zoom, pos, n])

  useHeaderOverlay()

  // "From" price = cheapest multi-day tour with a price; follows the tour data automatically.
  const prices = tours.filter((x) => x.days >= 2 && x.priceFrom != null).map((x) => x.priceFrom!)
  const fromPrice = prices.length ? Math.min(...prices) : null

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const sp = new URLSearchParams()
    if (q.trim()) sp.set('q', q.trim())
    if (dest) sp.set(regions.some((r) => r.slug === dest) ? 'region' : 'dest', dest)
    if (duration) sp.set('duration', duration)
    if (theme) sp.set('theme', theme)
    navigate(`${to('/tours')}${sp.size ? `?${sp}` : ''}`)
  }

  const label = 'mb-1 block text-xs font-bold tracking-wide text-muted uppercase'
  return (
    <section ref={sectionRef} className={`relative isolate overflow-hidden bg-brand-950 ${HERO_UNDER_HEADER}`}>
      <HeroMedia banner={b} images={cards.map((c) => c.bg)} image={cur?.bg ?? null} warm={started || hover} onShown={setReadyBg} />
      {/* Zoom layer: under the dark gradients (same -z-10, earlier in the DOM order than them) so the hand-over is seamless. */}
      {zoom && (
        <div
          key={zoom.id}
          aria-hidden
          className="absolute -z-10 overflow-hidden"
          style={{
            ...(zoom.grown ? { top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 } : { ...zoom.from, borderRadius: 16 }),
            opacity: zoom.leaving ? 0 : 1,
            transition: `top ${ZOOM_MS}ms ${EASE}, left ${ZOOM_MS}ms ${EASE}, width ${ZOOM_MS}ms ${EASE}, height ${ZOOM_MS}ms ${EASE}, border-radius ${ZOOM_MS}ms ${EASE}, opacity ${HANDOVER_MS}ms ease`,
          }}
        >
          <img src={zoom.thumb} alt="" className="absolute inset-0 size-full object-cover" />
          <img src={zoom.bg} alt="" className="absolute inset-0 size-full object-cover" />
        </div>
      )}
      {/* Phones: the text spans the full width over a bright photo, so the right side stays darker too. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/45 md:via-brand-950/50 md:to-brand-950/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-brand-950/70 to-transparent" aria-hidden />

      {/* The header floats transparently over the hero (HERO_UNDER_HEADER pads the section by its height: 97/113px,
          +40px top bar from md); this block fills the rest of the screen so text and cards are fully visible on arrival.
          pb-40 is the room the search form overlaps. */}
      <div className="container-x grid min-h-[calc(100svh-97px)] items-center gap-8 pt-10 pb-40 sm:min-h-[calc(100svh-113px)] md:min-h-[calc(100svh-153px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        {/* Left: brand message, or the picked destination. Keyed so the text replays its entrance on every change. */}
        <div
          key={txt?.d.slug ?? 'brand'}
          className={`max-w-xl ${textOut ? 'translate-y-3 opacity-0 transition duration-300 ease-in' : 'animate-fade-up'}`}
        >
          <p className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-wide text-white/90">
            <span className="h-0.5 w-8 bg-sun" aria-hidden />
            {txt ? l((txt.d.region && getDestination(txt.d.region)?.name) || txt.d.name) : l(b.eyebrow)}
          </p>
          {/* Sized so the brand title sets on two lines ("Private & Small-Group" / "Vietnam Tours"); the lg column is narrower than sm's full width. */}
          <h1 className="font-condensed text-3xl leading-[1.1] font-semibold text-white sm:text-5xl lg:text-[2.125rem] xl:text-[2.75rem]">{l(txt ? txt.d.name : b.title)}</h1>
          <p className="mt-5 max-w-md leading-relaxed text-white/80 md:text-lg">{l(txt ? txt.d.tagline : b.text)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <ButtonLink to={to(b.cta.path)} size="lg">
              {l(b.cta.label)} <ArrowRight className="size-5" aria-hidden />
            </ButtonLink>
            {txt ? (
              <Link
                to={to(`/destinations/${txt.d.slug}`)}
                className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-brand-900"
              >
                <MapPin className="size-4" aria-hidden /> {fmt(t.home.heroDiscover, { name: l(txt.d.name) })}
              </Link>
            ) : (
              fromPrice != null && (
                <p className="leading-tight text-white/80">
                  <span className="block text-xs font-semibold tracking-wide uppercase">{l(b.priceLabel)}</span>
                  <strong className="text-2xl font-bold text-white">USD {fromPrice.toLocaleString('en-US')}</strong>{' '}
                  <span className="text-sm">/ {t.common.perPerson}</span>
                </p>
              )
            )}
          </div>
        </div>

        {/* Right: destination cards. The track slides left by one card per step; cards already passed fade out. */}
        {n > 0 && (
          <div
            className="-mx-4 min-w-0 overflow-hidden px-4 pt-2 pb-2 [mask-image:linear-gradient(to_right,#000_70%,transparent)] lg:mx-0 lg:px-0 lg:[mask-image:linear-gradient(to_right,#000_80%,transparent)]"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <ul
              aria-label={t.home.heroCards}
              onTransitionEnd={(e) => e.target === e.currentTarget && onTrackEnd()}
              className={`flex gap-4 [--card:8rem] sm:[--card:10rem] xl:[--card:11rem] ${snap ? '' : 'transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none'}`}
              style={{ transform: `translateX(calc(${-pos} * (var(--card) + 1rem)))` }}
            >
              {track.map(({ d, card }, j) => {
                const region = d.region && getDestination(d.region)
                const passed = j < pos
                const hidden = passed || j >= pos + n - 1
                return (
                  <li
                    key={j}
                    aria-hidden={hidden}
                    className={`w-[var(--card)] shrink-0 ${snap ? '' : 'transition-[opacity,transform] duration-700 ease-out'} ${passed ? 'pointer-events-none -translate-y-4 scale-90 opacity-0' : 'opacity-100'}`}
                  >
                    <button
                      ref={(el) => {
                        cardRefs.current[j] = el
                      }}
                      type="button"
                      tabIndex={hidden ? -1 : undefined}
                      onClick={() => go(j)}
                      className="group relative block h-48 w-full overflow-hidden rounded-2xl text-left shadow-xl ring-1 ring-white/20 transition duration-300 hover:-translate-y-1.5 hover:ring-white/60 focus-visible:ring-2 focus-visible:ring-sun focus-visible:outline-none sm:h-56 xl:h-64"
                    >
                      <Img src={card} alt="" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-110" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                      {/* Tap hint on the first card until the visitor has picked a destination. */}
                      {!started && j === pos && (
                        <span className="pointer-events-none absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center sm:size-14" aria-hidden>
                          <span className="absolute inset-0 rounded-full bg-white/40 motion-safe:animate-ping" />
                          <span className="relative grid size-full place-items-center rounded-full bg-white/25 ring-1 ring-white/70 backdrop-blur-sm">
                            <Pointer className="size-6 text-white drop-shadow motion-safe:animate-tap sm:size-7" />
                          </span>
                        </span>
                      )}
                      <span className="absolute inset-x-3 bottom-3 block text-white">
                        {region && <span className="block text-[0.7rem] text-white/75">{l(region.name)}</span>}
                        <span className="mt-0.5 block font-condensed text-lg leading-tight font-semibold sm:text-xl">{l(d.name)}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="container-x relative -mt-32 pb-10">
        <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-2xl sm:grid-cols-2 md:p-5 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]" aria-label={t.home.searchTitle}>
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className={label}>{t.home.searchKeyword}</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.home.searchKeywordPh} className="field-input pl-10" />
            </span>
          </label>
          <label className="block">
            <span className={label}>{t.home.searchDestination}</span>
            <select value={dest} onChange={(e) => setDest(e.target.value)} className="field-input">
              <option value="">{t.home.searchAny}</option>
              {regions.map((r) => (
                <optgroup key={r.slug} label={l(r.name)}>
                  <option value={r.slug}>{`${l(r.name)} – ${t.nav.allDestinations}`}</option>
                  {citiesOf(r.slug).map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {l(c.name)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>{t.home.searchDuration}</span>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="field-input">
              <option value="">{t.home.searchAny}</option>
              {DURATION_BUCKETS.map((d) => (
                <option key={d} value={d}>
                  {t.tours.durations[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>{t.home.searchTheme}</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="field-input">
              <option value="">{t.home.searchAny}</option>
              {themes.map((th) => (
                <option key={th.slug} value={th.slug}>
                  {l(th.name)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 sm:col-span-2 lg:col-span-1">
            <Search className="size-4" aria-hidden /> {t.home.searchButton}
          </button>
        </form>
      </div>
    </section>
  )
}
