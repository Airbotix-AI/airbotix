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
    // Mobile: vertical logo, Desktop: horizontal logo
    HEIGHT: 'h-20 md:h-40',
    WIDTH: 'w-auto',
    MAX_WIDTH: 'max-w-24 md:max-w-96', // Mobile: square space, Desktop: wide space
  },
  FOOTER: {
    // Mobile: vertical logo, Desktop: horizontal logo  
    HEIGHT: 'h-20 md:h-24', 
    WIDTH: 'w-auto',
    MAX_WIDTH: 'max-w-20 md:max-w-56', // Mobile: larger space, Desktop: wide space
  },
} as const

// Responsive logo paths - mobile gets vertical, desktop gets horizontal
export const RESPONSIVE_LOGOS = {
  HEADER: {
    MOBILE: LOGO_PATHS.BLACK_VERTICAL,
    DESKTOP: LOGO_PATHS.BLACK_HORIZONTAL,
  },
  FOOTER: {
    MOBILE: LOGO_PATHS.WHITE_VERTICAL,
    DESKTOP: LOGO_PATHS.WHITE_HORIZONTAL,
  },
} as const

// Type definitions for logo variants
export type LogoVariant = typeof LOGO_PATHS[keyof typeof LOGO_PATHS]
