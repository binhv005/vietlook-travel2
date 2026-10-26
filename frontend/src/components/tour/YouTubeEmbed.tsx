import { useState } from 'react'
import { Play } from 'lucide-react'

/**
 * Click-to-load YouTube embed: shows the thumbnail first so the iframe (and
 * YouTube's scripts) only load when the visitor asks for the video.
 */
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false)
  return (
    <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-black">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Play video: ${title}`}>
          <img src={`https://i.ytimg.com/vi_webp/${encodeURIComponent(id)}/hqdefault.webp`} alt="" loading="lazy" className="size-full object-cover opacity-80 transition group-hover:opacity-100" />
          <span className="absolute top-1/2 left-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-500 text-white shadow-xl transition group-hover:scale-110">
            <Play className="ml-1 size-7" aria-hidden />
          </span>
        </button>
      )}
    </div>
  )
}
