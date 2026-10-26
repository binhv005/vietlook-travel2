import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Compass, FileCheck2, Headset, Languages, Layers, MapPinned, PlaneLanding, ShieldAlert, Stamp, Star, Users } from 'lucide-react'
import { citiesOf, regions } from '@/data/destinations'
import { themes } from '@/data/themes'
import { getTour, toursByDestination } from '@/data/tours'
import { featuredTourSlugs, reviews, sampleReviews } from '@/data/home'
import { site } from '@/data/site'
import { vehicles } from '@/data/vehicles'
import { posts } from '@/data/posts'
import type { Tour } from '@/data/types'
import { fmt, useI18n } from '@/i18n'
import SectionHeading from '../ui/SectionHeading'
import HandNote from '../ui/HandNote'
import Reveal from '../ui/Reveal'
import Img from '../ui/Img'
import { ButtonLink } from '../ui/Button'
import TourCard, { TourCardWide } from '../tour/TourCard'
import PostCard from '../guide/PostCard'
import VehicleCard from '../car/VehicleCard'
import ReviewsCarousel from './ReviewsCarousel'
import MapBackdrop from '../ui/MapBackdrop'
import LineMotif from '../ui/LineMotif'

/** The three core services named in the brief: tours, private car, visa & fast-track. */
export function ServicesBlock() {
  const { t, to } = useI18n()
  const s = t.home.services
  const items = [
    { ...s.tours, path: '/group-tailor-made-tours', image: '/images/tours/tam-coc-bich-dong.webp' },
    { ...s.car, path: '/private-car', image: '/images/cars/minivan-golf.webp' },
    { ...s.visa, path: '/visa-fast-track', image: '/images/tours/airport-pick-up-one-way.webp' },
  ]
  return (
    <section className="relative isolate overflow-hidden pt-8 pb-16 md:pb-20" aria-labelledby="home-services">
      {/* Faint Ha Long Bay photo behind the cards; fades in from the top so the heading stays on white. */}
      <img
        src="/images/hero/halong-bay.webp"
        alt=""
        aria-hidden
        data-no-reveal
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-center opacity-[0.16] [mask-image:linear-gradient(to_bottom,transparent,#000_45%)]"
      />
      <div className="container-x">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-2">{t.home.servicesEyebrow}</p>
            <h2 id="home-services" className="h-section">
              {t.home.servicesTitle}
            </h2>
          </div>
          <p className="max-w-md text-muted">{t.home.capTitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(({ t: title, d, cta, path, image }, i) => (
            <Reveal key={path} delay={i * 80}>
              <Link to={to(path)} className="card group flex h-full flex-col">
                <div className="overflow-hidden">
                  <Img src={image} alt="" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold group-hover:text-brand-700">{title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{d}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-600">
                    {cta} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WhyBlock() {
  const { t } = useI18n()
  const icons = [MapPinned, Compass, Layers, Languages, Headset, FileCheck2]
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-24" aria-labelledby="home-why">
      {/* Faint Hue citadel (paper texture above it) behind the right half only, fading in from its left edge. */}
      <img
        src="/images/huebg.webp"
        alt=""
        aria-hidden
        data-no-reveal
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-1/2 object-cover object-bottom opacity-40 [mask-image:linear-gradient(to_right,transparent,#000_35%)] lg:block"
      />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3">{t.home.whyEyebrow}</p>
          <h2 id="home-why" className="h-section">
            {t.home.whyTitle}
          </h2>
          <Img src="/images/tours/hoi-an-9-copy.webp" alt="" className="mt-8 hidden aspect-[4/3] w-full rounded-2xl object-cover lg:block" />
          <HandNote lines={t.home.notes.why} className="mt-6 hidden lg:flex" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {t.home.why.map((w, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={w.t} delay={i * 50} className="rounded-2xl border border-line bg-[url(/images/card-paper.webp)] bg-cover bg-right-top p-6 text-center shadow-sm">
                <Icon className="mx-auto size-7 text-brand-600" aria-hidden />
                <h3 className="mt-3 font-bold">{w.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{w.d}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Guest reviews: renders only real reviews from data/home.ts, plus links to the Google / TripAdvisor listings. */
export function ReviewsBlock() {
  const { t } = useI18n()
  const shownReviews = reviews.length > 0 ? reviews : sampleReviews
  return (
    <section className="bg-white py-20 md:py-24" aria-labelledby="home-reviews">
      <div className="relative container-x">
        <HandNote lines={t.home.notes.reviews} arrow="down-left" className="absolute top-6 right-6 hidden flex-row-reverse xl:flex" />
        <SectionHeading eyebrow={t.home.reviewsEyebrow} title={t.home.reviewsTitle} text={t.home.reviewsText} align="center" />
        {shownReviews.length > 0 ? (
          <ReviewsCarousel reviews={shownReviews} />
        ) : (
          <p className="mx-auto max-w-xl rounded-xl border border-dashed border-brand-200 bg-white p-6 text-center text-muted">{t.home.reviewsEmpty}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={site.googleReviewsUrl} variant="outline">
            <Star className="size-4" aria-hidden /> {t.home.reviewsGoogle}
          </ButtonLink>
          {site.tripadvisorUrl && (
            <ButtonLink href={site.tripadvisorUrl} variant="outline">
              <Star className="size-4" aria-hidden /> {t.home.reviewsTripadvisor}
            </ButtonLink>
          )}
        </div>
      </div>
      <ReviewsGallery />
    </section>
  )
}

const galleryImages = [
  'ha-long.webp',
  'hoi-an-9-copy.webp',
  'mua-cave.webp',
  'emperor-cruises.webp',
  'hoang-su-phi-ha-giang.webp',
  'imperial-citadel.webp',
  'da-lat.webp',
  'hanoi-bicycle-sunset-tour-1.webp',
  'my-son-holy-land-1.webp',
  'doi-che-moc-chau.webp',
  'mui-ne-sunset-tour.webp',
  'cham-islands-da-nang.webp',
].map((f) => `/images/tours/${f}`)

/** Endless strip of trip photos under the reviews; the list is doubled so the -50% marquee loops seamlessly. */
function ReviewsGallery() {
  return (
    <div className="group mt-14 overflow-hidden" aria-hidden>
      <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...galleryImages, ...galleryImages].map((src, i) => (
          <li key={i} className="shrink-0">
            <Img src={src} alt="" className="h-44 w-64 rounded-2xl object-cover md:h-56 md:w-80" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeaturedTours() {
  const { t, to } = useI18n()
  const [lead, ...rest] = featuredTourSlugs.map((s) => getTour(s)).filter((x): x is Tour => !!x)
  return (
    <section className="curve-bottom bg-sand py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.home.featuredEyebrow}
          title={t.home.featuredTitle}
          text={t.home.featuredText}
          action={
            <ButtonLink to={to('/tours')} variant="outline">
              {t.home.featuredAll} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          }
        />
        <Reveal>
          <TourCardWide tour={lead} />
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((tour, i) => (
            <Reveal key={tour.slug} delay={i * 80}>
              <TourCard tour={tour} showBook />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DestinationsBlock() {
  const { t, l, to } = useI18n()
  return (
    <section className="curve-bottom bg-mist py-20 md:py-24">
      <div className="relative container-x">
        <HandNote lines={t.home.notes.dest} arrow="down-right" className="absolute top-8 left-6 hidden xl:flex" />
        <SectionHeading eyebrow={t.home.destEyebrow} title={t.home.destTitle} text={t.home.destText} align="center" />
        <div className="grid gap-6 md:grid-cols-3">
          {regions.map((r, i) => (
            <Reveal key={r.slug} delay={i * 100}>
              <Link to={to(`/destinations/${r.slug}`)} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl">
                <Img src={r.image} alt={l(r.name)} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" aria-hidden />
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-800 shadow">
                  {(() => {
                    const n = toursByDestination(r.slug).length
                    return n === 1 ? t.common.tour : fmt(t.common.tours, { n })
                  })()}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-3xl font-semibold text-white">{l(r.name)}</h3>
                  <p className="mt-2 text-white/85">{l(r.tagline)}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {citiesOf(r.slug).map((c) => (
                      <li key={c.slug} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {l(c.name)}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sun">
                    {fmt(t.destinations.regionLink, { name: l(r.name) })} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Bento grid of themes (Aurora "tour styles"), followed by a strip with a different card style. */
export function ThemesBlock() {
  const { t, l, to } = useI18n()
  const [big, ...others] = themes
  const grid = others.slice(0, 4)
  const strip = others.slice(4)
  const tile = (th: (typeof themes)[number], large = false) => (
    <Link key={th.slug} to={to(`/tour-themes/${th.slug}`)} className={`group relative block overflow-hidden rounded-2xl ${large ? 'min-h-[320px] md:row-span-2 md:col-span-2' : 'min-h-[220px]'}`}>
      <Img src={th.image} alt="" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className={`font-semibold text-white ${large ? 'font-display text-3xl' : 'text-lg'}`}>{l(th.name)}</h3>
        <p className={`mt-1 text-white/80 ${large ? 'text-base' : 'text-sm'}`}>{l(th.short)}</p>
      </div>
    </Link>
  )
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.home.themeEyebrow}
          title={t.home.themeTitle}
          text={t.home.themeText}
          action={
            <ButtonLink to={to('/tour-themes')} variant="outline">
              {t.nav.allThemes} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          }
        />
        <Reveal className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          {tile(big, true)}
          {grid.map((th) => tile(th))}
        </Reveal>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {strip.map((th, i) => (
            <Reveal key={th.slug} delay={i * 80}>
              <Link to={to(`/tour-themes/${th.slug}`)} className="group flex items-center gap-4 rounded-2xl bg-white p-3 pr-5 shadow-sm transition hover:shadow-md">
                <Img src={th.image} alt="" className="size-24 shrink-0 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold group-hover:text-brand-700">{l(th.name)}</h3>
                  <p className="mt-1 text-sm text-muted">{l(th.short)}</p>
                </div>
                <ArrowRight className="ml-auto size-5 shrink-0 text-brand-500 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PartnerBlock() {
  const { t, to } = useI18n()
  return (
    <section className="relative isolate overflow-hidden bg-white pt-10 pb-20 md:py-28">
      <LineMotif variant="river" fill="#fff" className="absolute bottom-2 left-[-30px] -z-10 hidden w-[460px] text-sun opacity-35 md:block" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative pb-12 lg:pr-12">
          <Img src="/images/tours/emperor-cruises.webp" alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
          <Img src="/images/tours/hanoicitytour01daytrip.webp" alt="" className="absolute right-0 bottom-0 w-1/2 rounded-2xl border-[6px] border-white object-cover shadow-xl" />
          <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-800 shadow-lg">
            <Users className="size-4 text-accent-500" aria-hidden /> B2B
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow mb-3">{t.home.b2bEyebrow}</p>
          <h2 className="h-section">{t.home.b2bTitle}</h2>
          <p className="prose-body mt-5">{t.home.b2bText}</p>
          <ul className="mt-6 space-y-3">
            {t.home.b2bPoints.map((p) => (
              <li key={p} className="flex gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                <span className="font-medium">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={to('/travel-trade-partners')} size="lg">
              {t.home.b2bCta}
            </ButtonLink>
            <ButtonLink to={to('/tailor-made-tour')} variant="outline" size="lg">
              {t.nav.tailorMade}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Private car block: vehicle cards (type, models, "from" price per trip) linking to the quote form. */
export function CarBlock() {
  const { t, to } = useI18n()
  return (
    <section className="curve-bottom bg-sand py-20 md:py-24" aria-labelledby="home-car">
      <div className="container-x">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">{t.home.carEyebrow}</p>
            <h2 id="home-car" className="h-section">
              {t.home.carTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t.home.carText}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink to={to('/private-car')} variant="outline">
              {t.home.carMore} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink to={to('/private-car/quote')}>{t.home.carCta}</ButtonLink>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v, i) => (
            <Reveal key={v.slug} delay={i * 50}>
              <VehicleCard vehicle={v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function VisaBlock() {
  const { t, to } = useI18n()
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-24">
      <MapBackdrop />
      <div className="container-x grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Img src="/images/tours/welcome-vietlook.webp" alt={t.home.visaTitle} className="mx-auto aspect-[4/5] w-full max-w-sm rounded-2xl object-cover shadow-xl" />
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow mb-3">{t.home.visaEyebrow}</p>
          <h2 className="h-section">{t.home.visaTitle}</h2>
          <p className="prose-body mt-5">{t.home.visaText}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Stamp, ...t.visa.overview[0] },
              { icon: PlaneLanding, ...t.visa.overview[1] },
            ].map(({ icon: Icon, t: title, d }) => (
              <div key={title} className="rounded-xl border border-line bg-white/85 p-5 backdrop-blur-sm">
                <Icon className="size-6 text-brand-600" aria-hidden />
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-sun" aria-hidden />
            {t.home.visaNote}
          </p>
          <div className="mt-7">
            <ButtonLink to={to('/visa-fast-track')} variant="secondary">
              {t.home.visaCta} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function GuideBlock() {
  const { t, to } = useI18n()
  // Latest articles first.
  const [lead, ...rest] = [...posts].sort((a, b) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published))
  return (
    <section className="curve-bottom bg-mist py-20 md:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.home.guideEyebrow}
          title={t.home.guideTitle}
          action={
            <ButtonLink to={to('/travel-guide')} variant="outline">
              {t.home.guideAll} <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          }
        />
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <PostCard post={lead} variant="large" />
          </Reveal>
          <div className="space-y-5">
            {rest.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <PostCard post={p} variant="row" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
