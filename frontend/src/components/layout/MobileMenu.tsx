import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Phone, X } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { site } from '@/data/site'
import { useI18n } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import WeChatButton from './WeChatButton'
import type { NavItem } from './navigation'
import { buttonClass } from '../ui/Button'

/** Off-canvas navigation for tablet and mobile. */
export default function MobileMenu({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavItem[] }) {
  const { t, to } = useI18n()
  const [expanded, setExpanded] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Lock scrolling on <html>, not <body>: html has overflow-x: clip, so body's overflow never reaches the viewport.
    const root = document.documentElement
    root.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
      <div className="absolute inset-0 bg-brand-950/50" onClick={onClose} aria-hidden />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm animate-fade-up flex-col bg-white shadow-2xl">
        <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
          <img src={site.logo} alt={site.name} className="h-10 w-auto" />
          <button ref={closeRef} type="button" onClick={onClose} className="inline-flex size-11 items-center justify-center rounded-full border border-line" aria-label={t.nav.closeMenu}>
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="divide-y divide-line">
            {nav.map((item) => {
              const links = item.panel?.columns.flatMap((c) => c.links) ?? []
              const isOpen = expanded === item.key
              return (
                <li key={item.key} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link to={to(item.path)} className="flex-1 py-3 text-base font-semibold text-ink">
                      {item.label}
                    </Link>
                    {links.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.key)}
                        aria-expanded={isOpen}
                        aria-label={item.label}
                        className="inline-flex size-10 items-center justify-center rounded-full hover:bg-brand-50"
                      >
                        <ChevronDown className={`size-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                      </button>
                    )}
                  </div>
                  {isOpen && (
                    <ul className="mb-3 space-y-0.5 border-l-2 border-brand-100 pl-4">
                      {links.map((ln) => (
                        <li key={ln.path}>
                          <Link to={to(ln.path)} className="block py-2 text-[0.95rem] text-muted hover:text-brand-700">
                            {ln.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
            <li className="py-1">
              <Link to={to('/travel-trade-partners')} className="block py-3 text-base font-semibold text-accent-600">
                {t.nav.partners}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="space-y-3 border-t border-line p-5">
          <Link to={to('/tailor-made-tour')} className={buttonClass('primary', 'lg', 'w-full')}>
            {t.nav.plan}
          </Link>
          <div className="grid grid-cols-3 gap-2">
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClass('whatsapp', 'sm')}>
              <WhatsAppIcon className="size-4" aria-hidden /> {t.common.whatsapp}
            </a>
            <WeChatButton className={buttonClass('outline', 'sm')} />
            <a href={site.phoneHref} className={buttonClass('outline', 'sm')}>
              <Phone className="size-4" aria-hidden /> {t.common.call}
            </a>
          </div>
          <div className="flex justify-center pt-1">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}
