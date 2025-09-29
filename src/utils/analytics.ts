// Minimal GA: inject gtag with measurement ID only

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-0GZNJGRQRB'

let isInitialized = false

function loadGtag(measurementId: string): void {
  const existingScript = document.getElementById('ga4-script') as HTMLScriptElement | null
  if (existingScript) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  script.id = 'ga4-script'
  document.head.appendChild(script)

  const inline = document.createElement('script')
  inline.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}`
  document.head.appendChild(inline)
}

export function initAnalytics(): void {
  if (!GA_ID || typeof window === 'undefined') return
  if (isInitialized) return

  loadGtag(GA_ID)
  // @ts-expect-error gtag is injected at runtime
  window.gtag('js', new Date())
  // @ts-expect-error gtag is injected at runtime
  window.gtag('config', GA_ID)
  isInitialized = true
}

export function trackEvent(_eventName: string, _params?: Record<string, unknown>): void {
  // No-op in minimal GA setup
}
