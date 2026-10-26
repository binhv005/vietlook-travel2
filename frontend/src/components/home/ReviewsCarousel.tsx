import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import type { Review } from '@/data/home'
import { useI18n } from '@/i18n'
import Img from '../ui/Img'

const INTERVAL = 2000

function usePerView() {
  const get = () => (typeof window === 'undefined' ? 1 : window.matchMedia('(min-width: 1024px)').matches ? 3 : window.matchMedia('(min-width: 768px)').matches ? 2 : 1)
  const [n, setN] = useState(get)
  useEffect(() => {
    const onResize = () => setN(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return n
}

/**
 * Horizontal review slider: advances one card every 2s and loops seamlessly
 * (the list is rendered twice and snaps back once the first copy has scrolled
 * past). Pauses on hover / keyboard focus and for reduced-motion visitors.
 * Cards: guest photo on top, quote badge over its edge, headline, clamped text, stars and name.
 */
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const { l } = useI18n()
  const perView = usePerView()
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const n = reviews.length
  const canSlide = n > perView

  useEffect(() => {
    if (!canSlide || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => i + 1), INTERVAL)
    return () => window.clearInterval(id)
  }, [canSlide, paused])

  // Re-enable the transition on the frame after a silent snap back to the start.
  useEffect(() => {
    if (animate) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
    return () => cancelAnimationFrame(id)
  }, [animate])

  const onTransitionEnd = () => {
    if (index >= n) {
      setAnimate(false)
      setIndex(0)
    }
  }

  const go = (i: number) => {
    setAnimate(true)
    setIndex(i)
  }

  const items = canSlide ? [...reviews, ...reviews] : reviews
  const active = index % n

  const arrow = 'absolute top-[28%] z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-600 shadow-lg transition hover:bg-brand-600 hover:text-white md:flex'
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="-mx-3 overflow-hidden">
        <ul
          className={`flex py-2 ${animate ? 'transition-transform duration-700 ease-out' : ''}`}
          style={{ transform: `translateX(-${(index * 100) / perView}%)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {items.map((r, i) => (
            <li key={i} className="shrink-0 px-3" style={{ width: `${100 / perView}%` }} aria-hidden={canSlide && (i < index || i >= index + perView)}>
              <figure className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
                {r.image && <Img src={r.image} alt="" className="aspect-[16/10] w-full object-cover" />}
                <div className={`relative flex flex-1 flex-col px-7 pb-7 ${r.image ? 'pt-10' : 'pt-7'}`}>
                  <span
                    className={`flex size-14 items-center justify-center rounded-full bg-white text-brand-600 shadow-md ${r.image ? 'absolute -top-7 left-7' : 'mb-4'}`}
                    aria-hidden
                  >
                    <Quote className="size-5 fill-current" />
                  </span>
                  <blockquote className="line-clamp-4 leading-relaxed text-muted" lang={r.lang}>
                    {l(r.text)}
                  </blockquote>
                  <div className="mt-auto pt-6">
                    {r.rating && (
                      <span className="flex gap-1 text-sun" role="img" aria-label={`${r.rating}/5`}>
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star key={s} className={`size-5 ${s < r.rating! ? 'fill-current' : ''}`} aria-hidden />
                        ))}
                      </span>
                    )}
                    <figcaption className="mt-2 font-bold">
                      {r.author}
                      {r.country && <span className="text-sm font-normal text-muted"> · {r.country}</span>}
                      <span className="ml-2 text-xs font-normal text-muted uppercase">{r.source}</span>
                    </figcaption>
                  </div>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      {canSlide && (
        <>
          <button type="button" onClick={() => go(index === 0 ? n - 1 : index - 1)} aria-label="Previous" className={`${arrow} -left-6`}>
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next" className={`${arrow} -right-6`}>
            <ChevronRight className="size-6" aria-hidden />
          </button>
          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.author + i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1} / ${n}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-brand-600' : 'w-2 bg-brand-200'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
