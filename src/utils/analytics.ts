/*
  Google Analytics 4 lightweight helper with runtime switch and PII guard
*/

type EventParams = Record<string, unknown>

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
const GA_ENABLED = import.meta.env.VITE_ENABLE_GA === 'true'
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
  // @ts-expect-error - gtag injected at runtime
  window.gtag('js', new Date())
  // @ts-expect-error
  window.gtag('config', GA_ID, {
    send_page_view: false,
    app_name: 'airbotix-web',
    custom_map: {},
  })

  // Enable debug mode in development for easier DebugView linking
  if (IS_DEV) {
    // @ts-expect-error
    window.gtag('set', 'debug_mode', true)
  }

  isInitialized = true
}

export function trackPageView(currentUrl?: string): void {
  if (!isInitialized) return

  const url = currentUrl ?? (window.location?.href ?? '')
  // HashRouter path normalization
  const pagePath = (() => {
    const { hash } = window.location
    if (!hash) return '/'
    // remove leading '#'
    const path = hash.startsWith('#') ? hash.slice(1) : hash
    return path || '/'
  })()

  const params: Record<string, unknown> = {
    page_location: url,
    page_path: pagePath,
    page_title: document.title,
    referrer: document.referrer || undefined,
    env: import.meta.env.MODE,
    language: navigator.language,
  }

  if (IS_DEV) {
    params.debug_mode = true
    // eslint-disable-next-line no-console
    console.debug('[GA] page_view', params)
  }

  // @ts-expect-error
  window.gtag('event', 'page_view', params)
}

export function trackEvent(eventName: string, params?: EventParams): void {
  if (!isInitialized) return

  const safeParams = sanitizeParams(params)
  const payload: Record<string, unknown> = {
    ...safeParams,
    env: import.meta.env.MODE,
    app_name: 'airbotix-web',
  }
  if (IS_DEV) {
    payload.debug_mode = true
    // eslint-disable-next-line no-console
    console.debug('[GA] event', eventName, payload)
  }
  // @ts-expect-error
  window.gtag('event', eventName, payload)
}

function sanitizeParams(input?: EventParams): EventParams {
  if (!input) return {}
  const clone: EventParams = { ...input }

  // Drop potential PII keys
  const piiKeys = [/email/i, /name/i, /phone/i, /address/i]
  for (const key of Object.keys(clone)) {
    if (piiKeys.some(r => r.test(key))) {
      delete clone[key]
    }
  }
  return clone
}

export function extractEmailDomain(email?: string): string | undefined {
  if (!email || !email.includes('@')) return undefined
  return email.split('@')[1]
}


