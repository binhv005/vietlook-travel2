/**
 * Business details supplied by Vietlook. These are the only facts about the
 * company the site states; everything else is either content or a demo record.
 * Intended to move into "General Website Settings" in the CMS.
 */
export const site = {
  name: 'Vietlook Travel Operators',
  shortName: 'Vietlook Travel',
  address: { en: '58, Yen Nghia Ward, Hanoi, Vietnam', zh: '越南河内市 Yen Nghia 坊 58 号' },
  contactPerson: 'Thuy Yen',
  phone: '+84 983 393 488',
  phoneHref: 'tel:+84983393488',
  whatsappHref: 'https://wa.me/84983393488',
  facebook: 'https://www.facebook.com/vietlooktravelhanoi',
  mapsUrl: 'https://maps.app.goo.gl/ar5pqAHXgeW42U7W9',
  mapsEmbed: 'https://www.google.com/maps?q=Yen+Nghia,+Ha+Dong,+Hanoi,+Vietnam&output=embed',
  logo: '/images/brand/logo-vietlook.webp',
  /** PNG copy for the favicon and structured data (JSON-LD), where PNG is the safest format. */
  logoPng: '/images/brand/logo-vietlook.png',
  /*
   * Not supplied yet — set these when Vietlook confirms them. Until then the
   * UI hides the email row, and the WeChat button explains the ID is pending.
   */
  email: null as string | null,
  wechatId: null as string | null,
  /** Optional WeChat QR image path, e.g. '/images/brand/wechat-qr.png'. */
  wechatQr: null as string | null,
  tripadvisorUrl: null as string | null,
  /** Google reviews live on the Google Maps business listing. */
  googleReviewsUrl: 'https://maps.app.goo.gl/ar5pqAHXgeW42U7W9',
}

export const SITE_URL = (import.meta.env?.VITE_SITE_URL as string | undefined) || 'https://www.vietlooktravel.com'
