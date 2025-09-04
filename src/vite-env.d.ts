interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID?: string
  readonly VITE_FORMSPREE_BOOK_ID?: string
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
