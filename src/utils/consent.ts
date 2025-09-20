export const ANALYTICS_CONSENT_KEY = 'airbotix_analytics_consent'

type ConsentState = 'granted' | 'denied'

export function getConsent(): ConsentState | null {
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY)
    if (value === 'granted' || value === 'denied') return value
    return null
  } catch {
    return null
  }
}

export function isConsented(): boolean {
  return getConsent() === 'granted'
}

export function setConsent(state: ConsentState): void {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, state)
  } catch {
    // no-op
  }
}


