import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import { fmt, useI18n } from '@/i18n'
import Img from '../ui/Img'

/** One large + four small photo grid with a keyboard-accessible lightbox. */
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const { t } = useI18n()
  const [index, setIndex] = useState<number | null>(null)
  const close = useCallback(() => setIndex(null), [])
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    // Lock scrolling on <html>, not <body>: html has overflow-x: clip, so body's overflow never reaches the viewport.
    const root = document.documentElement
    root.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [index, close, step])

  const [first, ...rest] = images
  return (
    <>
      <div className="relative grid gap-2 overflow-hidden rounded-2xl md:grid-cols-4 md:grid-rows-2">
        <button type="button" onClick={() => setIndex(0)} className="group relative overflow-hidden md:col-span-2 md:row-span-2" aria-label={fmt(t.tour.openPhoto, { n: 1 })}>
          <Img src={first} alt={title} priority className="aspect-[3/2] size-full object-cover transition duration-500 group-hover:scale-105 md:aspect-auto md:min-h-[420px]" />
        </button>
        {rest.slice(0, 4).map((src, i) => (
          <button key={src} type="button" onClick={() => setIndex(i + 1)} className="group relative hidden overflow-hidden md:block" aria-label={fmt(t.tour.openPhoto, { n: i + 2 })}>
            <Img src={src} alt="" className="aspect-[3/2] size-full object-cover transition duration-500 group-hover:scale-105" />
          </button>
        ))}
        <button type="button" onClick={() => setIndex(0)} className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lg hover:bg-brand-50">
          <Images className="size-4" aria-hidden /> {t.tour.allPhotos} ({images.length})
        </button>
      </div>

      {/* Portalled to <body> so the page's stacking contexts (e.g. the isolated tour header band) can't put the sticky booking panel above it. */}
      {index !== null && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={t.tour.gallery}>
          <button type="button" onClick={close} className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label={t.common.close} autoFocus>
            <X className="size-6" aria-hidden />
          </button>
          <button type="button" onClick={() => step(-1)} className="absolute left-3 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label={t.common.previous}>
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <figure className="max-h-full max-w-5xl">
            <img src={images[index]} alt={`${title} – ${index + 1}`} className="max-h-[80vh] w-auto rounded-lg object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/70">
              {index + 1} / {images.length}
            </figcaption>
          </figure>
          <button type="button" onClick={() => step(1)} className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label={t.common.next}>
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </div>,
        document.body,
      )}
    </>
  )
}
