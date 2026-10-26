import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

/**
 * Router-level error screen. Rendered outside the locale layout, so it is
 * self-contained and bilingual (e.g. when a page chunk fails to download).
 */
export default function RouteError() {
  const error = useRouteError()
  const zh = window.location.pathname.startsWith('/zh')
  const status = isRouteErrorResponse(error) ? error.status : undefined
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
      <img src="/images/brand/logo-vietlook.webp" alt="Vietlook Travel" className="h-16 w-auto" />
      <h1 className="mt-8 text-2xl font-bold">{zh ? '出现错误' : 'Something went wrong'}</h1>
      <p className="mt-2 max-w-md text-muted">
        {status === 404 ? (zh ? '页面不存在。' : 'This page does not exist.') : zh ? '页面加载失败，请检查网络后重试。' : 'This page could not be loaded. Please check your connection and try again.'}
      </p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600">
          {zh ? '重试' : 'Try again'}
        </button>
        <a href={zh ? '/zh' : '/en'} className="rounded-full border border-brand-600 px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
          {zh ? '返回首页' : 'Go to homepage'}
        </a>
      </div>
    </main>
  )
}
