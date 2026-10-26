import type { L, LList } from './types'

/**
 * Homepage content blocks. Shaped like the future CMS records
 * ("Quản lý banner trang chủ" / "Quản lý các khối nội dung trang chủ"), so the
 * page renders the same once this file is replaced by an API call.
 */
export interface HeroBanner {
  /** Fallback / poster image (also used when the visitor prefers reduced motion or data saving). */
  image: string
  /** Phones (below 768px) show this portrait photo instead and never load the video. */
  mobileImage: string
  /** Optional background video for tablets/desktops: compressed H.264 MP4, muted, looping. Source master kept in /media-source. */
  video?: { src: string; poster: string }
  imageAlt: L
  /**
   * Destination cards in the hero (slugs from data/destinations). The card shows `card` and picking it makes `bg`
   * the hero background; both are cut from the same photo (the sharpest relevant original in AnhSanpham /
   * media-source): `bg` is 1920px wide, `card` a 384x560 portrait crop. Files live in /images/hero.
   */
  cards: { slug: string; bg: string; card: string }[]
  eyebrow: L
  title: L
  text: L
  /** Short benefit points shown under the text. */
  benefits: LList
  /** Label before the "from" price; the amount is computed from the tour data (cheapest multi-day tour). */
  priceLabel: L
  /** The single primary call to action. */
  cta: { label: L; path: string }
}

export const heroBanner: HeroBanner = {
  image: '/videos/hero-sunset-poster.webp',
  mobileImage: '/images/hero/sapa-portrait.webp',
  video: { src: '/videos/hero-sunset-736.mp4', poster: '/videos/hero-sunset-poster.webp' },
  // Covers both the desktop sunset and the phone photo (Fansipan, Sapa).
  imageAlt: { en: 'Vietnamese mountains rising above a sea of clouds', zh: '越南群山耸立于云海之上' },
  cards: ['halong-bay', 'ninh-binh', 'ha-giang', 'sapa', 'hoi-an', 'hue', 'da-nang', 'phu-quoc'].map((slug) => ({
    slug,
    bg: `/images/hero/${slug}.webp`,
    card: `/images/hero/${slug}-card.webp`,
  })),
  // Product + benefit + "from" price + one CTA (landing-page brief for Ads).
  eyebrow: { en: 'Local tour operator in Hanoi · since 2009', zh: '河内本地地接社 · 始于 2009 年' },
  title: { en: 'Private & Small-Group Vietnam Tours', zh: '越南私人团与小团游' },
  text: {
    en: 'Tailor-made itineraries from Hanoi to the Mekong, with a private car, local guides and hotels chosen for you.',
    zh: '从河内到湄公河的定制行程，配备专车、当地导游，并为您精选酒店。',
  },
  benefits: {
    en: ['Private car & local guide', 'Free quote within 48 hours', 'No online payment'],
    zh: ['专车与当地导游', '48 小时内免费报价', '无需在线付款'],
  },
  priceLabel: { en: 'Tours from', zh: '线路起价' },
  cta: { label: { en: 'Get a free quote', zh: '免费获取报价' }, path: '/tailor-made-tour' },
}

/** Slugs of the long tours featured on the homepage (first one is shown large). */
export const featuredTourSlugs = ['vietnam-classic-14-days', 'vietnam-grand-journey-21-days', 'halong-ninh-binh-danang-hoi-an-10-days', 'northern-vietnam-highlights-7-days']

export interface Review {
  author: string
  country?: string
  text: L
  source: 'google' | 'tripadvisor'
  /** Star rating (1–5) exactly as given on the source listing. */
  rating?: number
  /** BCP 47 code of the language the review was written in, when it is shown untranslated. */
  lang?: string
  url?: string
  /** Guest photo from the trip, shown at the top of the card. */
  image?: string
  /** Review headline as written by the guest on the source listing. */
  title?: L
}

/**
 * Guest reviews. Intentionally empty: only real reviews copied from Vietlook's
 * Google / TripAdvisor listings may be added here (or imported via the CMS).
 */
export const reviews: Review[] = []

const same = (s: string): L => ({ en: s, zh: s })

/**
 * Layout preview only: rendered in `npm run dev` while `reviews` is empty and
 * never shipped in a production build. Not real guest reviews.
 */
export const sampleReviews: Review[] = [
  { author: 'Emily Carter', rating: 5, image: '/images/tours/hoang-su-phi-ha-giang.webp', country: 'UK', lang: 'en', source: 'google', text: same('Our guide Minh made the Ha Giang loop unforgettable. The rice terraces at Hoang Su Phi were breathtaking, and every homestay was warm and spotless. Everything ran perfectly on time.') },
  { author: 'Camille Laurent', rating: 5, image: '/images/tours/dam-van-long-ninh-binh.webp', country: 'France', lang: 'fr', source: 'tripadvisor', text: same('Une balade en barque magique à Van Long, au milieu des montagnes karstiques. L’organisation était impeccable, le guide parlait très bien français et a su s’adapter à nos envies.') },
  { author: 'Lukas Becker', rating: 5, image: '/images/tours/ha-long.webp', country: 'Germany', lang: 'de', source: 'google', text: same('Die Nacht auf dem Schiff in der Halong-Bucht war der Höhepunkt unserer Reise. Tolle Kabine, hervorragendes Essen und ein sehr aufmerksames Team. Absolut empfehlenswert!') },
  { author: 'Wang Li', rating: 5, image: '/images/tours/hoi-an-9-copy.webp', country: 'China', lang: 'zh', source: 'tripadvisor', text: same('会安古镇的夜晚太美了，灯笼和小船让人流连忘返。导游非常专业热情，行程安排合理，酒店也很舒适，下次还会选择这家旅行社。') },
  { author: 'Lucía Martínez', rating: 5, image: '/images/tours/mua-cave.webp', country: 'Spain', lang: 'es', source: 'google', text: same('Subir a la cueva de Mua al atardecer fue espectacular, las vistas de Ninh Binh son increíbles. El equipo lo organizó todo a la perfección y siempre respondió rápido a nuestras dudas.') },
  { author: 'Kim Min-ji', rating: 5, image: '/images/tours/da-lat.webp', country: 'Korea', lang: 'ko', source: 'tripadvisor', text: same('달랏의 선선한 날씨와 아름다운 꽃밭이 정말 좋았어요. 가이드님이 친절하고 일정도 여유로워서 가족 여행으로 딱이었습니다. 강력 추천합니다!') },
]
