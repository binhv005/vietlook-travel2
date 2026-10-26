import { site, SITE_URL } from '@/data/site'
import { useI18n } from '@/i18n'
import Seo from '@/components/ui/Seo'
import HomeHero from '@/components/home/HomeHero'
import { CarBlock, DestinationsBlock, FeaturedTours, GuideBlock, PartnerBlock, ReviewsBlock, ServicesBlock, ThemesBlock, VisaBlock, WhyBlock } from '@/components/home/HomeSections'
import PlanTripForm from '@/components/home/PlanTripForm'

export default function Home() {
  const { t } = useI18n()
  const org = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: site.name,
    url: SITE_URL,
    logo: `${SITE_URL}${site.logoPng}`,
    telephone: site.phone,
    address: { '@type': 'PostalAddress', streetAddress: '58, Yen Nghia Ward', addressLocality: 'Hanoi', addressCountry: 'VN' },
    sameAs: [site.facebook],
  }
  return (
    <>
      <Seo title={t.meta.siteTitle} path="" jsonLd={org} />
      <HomeHero />
      <ServicesBlock />
      <FeaturedTours />
      <ThemesBlock />
      <DestinationsBlock />
      <WhyBlock />
      <PartnerBlock />
      <CarBlock />
      <VisaBlock />
      <ReviewsBlock />
      <GuideBlock />
      <PlanTripForm />
    </>
  )
}
