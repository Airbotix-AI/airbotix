// Asset constants - following string-constants rules
// All asset paths must be defined as constants to avoid magic strings

const BASE_PATH = import.meta.env.MODE === 'production' ? '/airbotix-website' : ''

export const LOGO_PATHS = {
  BLACK_HORIZONTAL: `${BASE_PATH}/logo-black-horizontal.png`,
  BLACK_VERTICAL: `${BASE_PATH}/logo-black-vertical.png`,
  WHITE_HORIZONTAL: `${BASE_PATH}/logo-white-horizontal.png`,
  WHITE_VERTICAL: `${BASE_PATH}/logo-white-vertical.png`,
} as const

export const FAVICON_PATHS = {
  ICON: `${BASE_PATH}/logo-black-vertical.png`,
  APPLE_TOUCH: `${BASE_PATH}/logo-black-vertical.png`,
  SHORTCUT: `${BASE_PATH}/logo-black-vertical.png`,
} as const

export const ALT_TEXTS = {
  LOGO: 'Airbotix Logo',
  LOGO_MAIN: 'Airbotix - AI and Robotics Education',
} as const

export const LOGO_SIZES = {
  HEADER: {
    HEIGHT: 'h-24 md:h-40',
    WIDTH: 'w-auto',
    MAX_WIDTH: 'max-w-64 md:max-w-96', // Responsive max width
  },
  FOOTER: {
    HEIGHT: 'h-12 md:h-24', 
    WIDTH: 'w-auto',
    MAX_WIDTH: 'max-w-48 md:max-w-56', // Reasonable max width for footer
  },
} as const

// Type definitions for logo variants
export type LogoVariant = typeof LOGO_PATHS[keyof typeof LOGO_PATHS]
