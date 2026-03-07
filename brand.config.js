/**
 * Cấu hình branding / theme — dùng chung cho Tailwind và app.
 * Chỉnh tại đây thay vì .env (VITE_SITE_*).
 */
export default {
  // Site info
  SITE_NAME: 'NetTruyenStore',
  SITE_LOGO_TEXT: 'NetTruyenStore',
  SITE_DOMAIN: 'nettruyenstore.com',
  SITE_BRAND_EMAIL: '',
  SITE_TWITTER_HANDLE: '',

  // Màu brand theo logo NetTruyen: xanh dương (N), xanh lá (e), cam (t), hồng (Truyen)
  SITE_PRIMARY_COLOR: '#0EA5E9', // xanh dương N
  SITE_PRIMARY_COLOR_2: '#EC4899', // hồng magenta Truyen
  SITE_SECONDARY_COLOR: '#22C55E', // xanh lá e
  SITE_GRADIENT_FROM: '#0EA5E9', // xanh dương
  SITE_GRADIENT_TO: '#EC4899', // hồng magenta

  // Font — khớp với tên trên Google Fonts; nếu đổi cần thêm vào index.html (link Google Fonts)
  FONT_SYSTEM: 'DM Sans', // font chữ hệ thống (body, form, UI)
  FONT_LOGO: 'Oswald', // font logo & tiêu đề brand
  FONT_TITLE: 'Oswald', // font tiêu đề / label (comic, section)
  FONT_COMIC: 'Patrick Hand' // font chữ truyện / bubble
}
