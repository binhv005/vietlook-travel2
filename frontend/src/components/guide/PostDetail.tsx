import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Check, ChevronRight, Clock3, Facebook, Link2, Linkedin, ListTree, Mail, PenLine, Twitter } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import type { Post } from '@/data/types'
import { EDITOR, getCategory, posts } from '@/data/posts'
import { getTour } from '@/data/tours'
import { site, SITE_URL } from '@/data/site'
import { fmt, useI18n } from '@/i18n'
import Seo from '../ui/Seo'
import Img from '../ui/Img'
import Breadcrumb from '../ui/Breadcrumb'
import TourCard from '../tour/TourCard'
import CtaBanner from '../sections/CtaBanner'
import { formatDate } from './PostCard'

/** Share links to the usual networks plus copy-to-clipboard. */
function ShareRow({ url, title }: { url: string; title: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const ti = encodeURIComponent(title)
  const links = [
    { label: 'WhatsApp', icon: WhatsAppIcon, href: `https://wa.me/?text=${ti}%20${u}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${u}&text=${ti}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'Email', icon: Mail, href: `mailto:?subject=${ti}&body=${u}` },
  ]
  const btn = 'inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand-500 hover:bg-brand-500 hover:text-white'
  const copy = () =>
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold">{t.guide.share}:</span>
      {links.map(({ label, icon: Icon, href }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={btn}>
          <Icon className="size-4" aria-hidden />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label={copied ? t.guide.linkCopied : t.guide.copyLink} title={copied ? t.guide.linkCopied : t.guide.copyLink} className={btn}>
        {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      </button>
    </div>
  )
}

/** Body paragraphs; lines starting with "## " become sub-headings and runs of "• " lines become a list. */
function Body({ lines }: { lines: string[] }) {
  const out: ReactNode[] = []
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i]
    if (s.startsWith('## ')) {
      out.push(<h3 key={i} className="mt-6 text-lg font-bold text-ink">{s.slice(3)}</h3>)
    } else if (s.startsWith('• ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('• ')) items.push(lines[i++].slice(2))
      i--
      out.push(
        <ul key={i} className="mt-4 list-disc space-y-1.5 pl-6 marker:text-brand-500">
          {items.map((x) => <li key={x}>{x}</li>)}
        </ul>,
      )
    } else {
      out.push(<p key={i}>{s}</p>)
    }
  }
  return <div className="prose-body mt-4 [&>h3+p]:mt-2 [&>p]:mt-4 [&>p:first-child]:mt-0">{out}</div>
}

/**
 * Article template: cover banner with title, then the article on the left and a sticky table of contents on the
 * right from xl up (smaller screens get the inline, collapsible table of contents instead).
 */
export default function PostDetail({ post }: { post: Post }) {
  const { t, l, ll, to, lang } = useI18n()
  const cat = getCategory(post.category)
  const parent = cat?.parent ? getCategory(cat.parent) : undefined
  const toc = post.sections.map((s, i) => ({ id: `section-${i + 1}`, label: l(s.heading) }))
  const [active, setActive] = useState(toc[0]?.id)

  // Highlight the section being read.
  useEffect(() => {
    const els = toc.map((x) => document.getElementById(x.id)).filter((x): x is HTMLElement => !!x)
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-30% 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.slug, lang])

  const text = post.sections.flatMap((s) => ll(s.body)).join(' ')
  const minutes = Math.max(2, Math.round(lang === 'zh' ? text.length / 400 : text.split(/\s+/).length / 200))
  const others = posts.filter((p) => p.slug !== post.slug)
  const interested = others.filter((p) => p.category === post.category || p.destinations.some((d) => post.destinations.includes(d))).slice(0, 5)
  // Prefer posts not already listed above so the grid adds something new.
  const relPosts = [...others.filter((p) => !interested.includes(p)), ...interested].slice(0, 6)
  const relTours = post.relatedTours.map(getTour).filter((x) => !!x)
  const url = `${SITE_URL}/${lang}/travel-guide/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: l(post.title),
    description: l(post.excerpt),
    image: `${SITE_URL}${post.cover}`,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: { '@type': 'Organization', name: l(EDITOR) },
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${SITE_URL}${site.logoPng}` } },
    inLanguage: lang === 'zh' ? 'zh-Hans' : 'en',
  }

  return (
    <>
      <Seo title={l(post.title)} description={l(post.excerpt)} path={`/travel-guide/${post.slug}`} image={post.cover} type="article" jsonLd={jsonLd} />
      <article>
        <header className="relative isolate flex min-h-[300px] items-center overflow-hidden bg-brand-950 md:min-h-[380px]">
          <Img src={post.cover} alt="" priority className="absolute inset-0 -z-10 size-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />
          <div className="container-x max-w-4xl py-14 text-center text-white">
            <div className="[&_ol]:justify-center">
              <Breadcrumb
                light
                items={[
                  { label: t.nav.guide, to: '/travel-guide' },
                  ...(parent ? [{ label: l(parent.name), to: `/travel-guide/${parent.slug}` }] : []),
                  ...(cat ? [{ label: l(cat.name), to: `/travel-guide/${cat.slug}` }] : []),
                  { label: l(post.title) },
                ]}
              />
            </div>
            <h1 className="h-display mt-4 text-white">{l(post.title)}</h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/85">
              <span className="flex items-center gap-1.5">
                <PenLine className="size-4" aria-hidden /> {t.common.by} <strong className="text-white">{l(EDITOR)}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden /> <time dateTime={post.updated ?? post.published}>{formatDate(post.updated ?? post.published, lang)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" aria-hidden /> {fmt(t.common.minRead, { n: minutes })}
              </span>
            </div>
          </div>
        </header>

        <div className="container-x py-12 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
          <div className="mx-auto max-w-3xl xl:mx-0 xl:max-w-none">
          <p className="text-lg leading-8 text-ink">{l(post.excerpt)}</p>
          {post.intro && <Body lines={ll(post.intro)} />}

          {toc.length > 1 && (
            <details className="mt-8 rounded-xl border border-line bg-mist p-5 xl:hidden" open>
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide uppercase">
                <ListTree className="size-4 text-brand-600" aria-hidden /> {t.guide.toc}
              </summary>
              <ol className="mt-4 space-y-2 text-[0.95rem]">
                {toc.map((x, i) => (
                  <li key={x.id}>
                    <a href={`#${x.id}`} className="flex gap-2 text-brand-700 hover:underline">
                      <span className="tabular-nums">{i + 1}.</span> {x.label}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          {post.sections.map((s, i) => (
            <section key={i} id={toc[i].id} className="mt-10 scroll-mt-40">
              <h2 className="font-display text-2xl font-semibold sm:text-[1.75rem]">{l(s.heading)}</h2>
              <Body lines={ll(s.body)} />
              {s.image && <Img src={s.image} alt={l(s.heading)} className="mx-auto mt-6 aspect-[3/2] w-full rounded-xl object-cover" />}
            </section>
          ))}

          {interested.length > 0 && (
            <aside className="mt-12">
              <h3 className="inline-block border-b-2 border-accent-500 pb-1 text-lg font-bold">{t.guide.interested}</h3>
              <ul className="mt-4 space-y-2">
                {interested.map((p) => (
                  <li key={p.slug}>
                    <Link to={to(`/travel-guide/${p.slug}`)} className="flex items-start gap-1.5 text-brand-700 hover:underline">
                      <ChevronRight className="mt-1 size-4 shrink-0" aria-hidden /> {l(p.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <footer className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            {cat && (
              <p className="text-sm">
                <span className="font-semibold">{t.guide.categoryLabel}:</span>{' '}
                <Link to={to(`/travel-guide/${cat.slug}`)} className="text-brand-700 hover:underline">
                  {l(cat.name)}
                </Link>
              </p>
            )}
            <ShareRow url={url} title={l(post.title)} />
          </footer>

          {relPosts.length > 0 && (
            <section className="mt-12">
              <h3 className="inline-block border-b-2 border-accent-500 pb-1 text-lg font-bold">{t.guide.relatedPosts}</h3>
              <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-3">
                {relPosts.map((p) => (
                  <li key={p.slug} className="group">
                    <Link to={to(`/travel-guide/${p.slug}`)} className="block">
                      <div className="overflow-hidden rounded-lg">
                        <Img src={p.cover} alt="" className="aspect-[3/2] w-full object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <h4 className="mt-2 line-clamp-2 text-[0.95rem] leading-snug font-semibold group-hover:text-brand-700">{l(p.title)}</h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          </div>

          {toc.length > 1 && (
            <aside aria-label={t.guide.toc} className="hidden xl:block">
              <nav className="sticky top-[170px] max-h-[calc(100vh-200px)] overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-sm">
                <p className="mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wide uppercase">
                  <ListTree className="size-4 text-brand-600" aria-hidden /> {t.guide.toc}
                </p>
                <ol className="space-y-1 text-[0.95rem]">
                  {toc.map((x, i) => (
                    <li key={x.id}>
                      <a
                        href={`#${x.id}`}
                        className={`flex gap-2 rounded-lg px-3 py-2 leading-snug transition ${active === x.id ? 'bg-brand-50 font-semibold text-brand-700' : 'text-muted hover:bg-mist hover:text-brand-700'}`}
                      >
                        <span className="tabular-nums">{i + 1}.</span> {x.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
        </div>
      </article>

      {relTours.length > 0 && (
        <section className="bg-sand py-16">
          <div className="container-x">
            <h2 className="h-section mb-8">{t.guide.relatedTours}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relTours.slice(0, 3).map((x) => (
                <TourCard key={x!.slug} tour={x!} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBanner title={t.guide.ctaTitle} text={t.guide.ctaText} image={post.cover} />
    </>
  )
}
