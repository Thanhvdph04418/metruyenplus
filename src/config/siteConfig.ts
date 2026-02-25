// Branding: nguồn duy nhất từ brand.config.js (không dùng .env VITE_SITE_*)
import brand from '../../brand.config.js'

export const SITE_NAME = brand.SITE_NAME
export const SITE_LOGO_TEXT = brand.SITE_LOGO_TEXT ?? brand.SITE_NAME

export const SITE_DOMAIN = brand.SITE_DOMAIN
export const SITE_URL =
  import.meta.env.VITE_URL_WEBSITE || `https://${brand.SITE_DOMAIN}`

export const SITE_BRAND_EMAIL = brand.SITE_BRAND_EMAIL
export const SITE_TWITTER_HANDLE = brand.SITE_TWITTER_HANDLE

export const SITE_PRIMARY_COLOR = brand.SITE_PRIMARY_COLOR
export const SITE_PRIMARY_COLOR_2 = brand.SITE_PRIMARY_COLOR_2
export const SITE_SECONDARY_COLOR = brand.SITE_SECONDARY_COLOR
export const SITE_GRADIENT_FROM = brand.SITE_GRADIENT_FROM ?? brand.SITE_PRIMARY_COLOR
export const SITE_GRADIENT_TO = brand.SITE_GRADIENT_TO ?? brand.SITE_PRIMARY_COLOR_2

// Font (brand.config.js) — dùng khi cần tên font ở runtime (inline style, SVG, canvas)
export const SITE_FONT_SYSTEM = brand.FONT_SYSTEM
export const SITE_FONT_LOGO = brand.FONT_LOGO
export const SITE_FONT_TITLE = brand.FONT_TITLE
export const SITE_FONT_COMIC = brand.FONT_COMIC
