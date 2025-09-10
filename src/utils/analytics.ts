// Lightweight GA4 helper for production-only tracking

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
    __gaLoaded?: boolean
  }
}

const isProd = typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD === true
const GA_ID: string | undefined = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GA_MEASUREMENT_ID) || undefined

function doNotTrackEnabled(): boolean {
  try {
    return (navigator as any)?.doNotTrack === '1' || (window as any)?.doNotTrack === '1'
  } catch {
    return false
  }
}

export function loadGA(measurementId?: string): void {
  const id = measurementId || GA_ID
  if (!isProd || !id || doNotTrackEnabled()) return
  if (window.__gaLoaded) return

  // Initialize dataLayer/gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer!.push(arguments)
  }

  // Inject gtag.js
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)

  // Configure GA
  window.gtag('js', new Date())
  window.gtag('config', id, {
    anonymize_ip: true,
  })

  window.__gaLoaded = true
}

export function pageview(path: string): void {
  if (!window.gtag) return
  try {
    window.gtag('event', 'page_view', {
      page_location: window.location?.href,
      page_path: path,
      page_title: document?.title,
    })
  } catch {
    // no-op
  }
}

export function trackEvent(name: string, params?: Record<string, any>): void {
  if (!window.gtag || !name) return
  try {
    window.gtag('event', name, params || {})
  } catch {
    // no-op
  }
}


