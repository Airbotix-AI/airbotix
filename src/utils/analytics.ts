// Minimal GA: inject gtag with measurement ID only

// Fallback to known Measurement ID to ensure GA works even if env is missing
const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-0GZNJGRQRB'
const GA_ENABLED = true
const IS_DEV = import.meta.env.DEV === true

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
  if (!GA_ENABLED || !GA_ID || typeof window === 'undefined') return
  if (isInitialized) return

  loadGtag(GA_ID)

  // basic config
  // @ts-expect-error gtag is injected at runtime
  window.gtag('js', new Date())
  // @ts-expect-error gtag is injected at runtime
  window.gtag('config', GA_ID)

  // Enable debug mode in development for easier DebugView linking
  if (IS_DEV) {
    // @ts-expect-error gtag is injected at runtime
    window.gtag('set', 'debug_mode', true)
  }

  isInitialized = true
}

export function trackPageView(): void {}

export function trackEvent(_eventName: string, _params?: Record<string, unknown>): void {
  // No-op in minimal GA setup
}

// remove unused to satisfy lint

export function extractEmailDomain(email?: string): string | undefined {
  if (!email || !email.includes('@')) return undefined
  return email.split('@')[1]
}


