/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID?: string
  readonly VITE_FORMSPREE_BOOK_ID?: string
  readonly VITE_CONTACT_EMAIL?: string
  // more env variables...
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
