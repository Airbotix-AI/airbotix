/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly VITE_FORMSPREE_ID?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_ENABLE_GA?: string
  readonly VITE_GA4_MEASUREMENT_ID?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
