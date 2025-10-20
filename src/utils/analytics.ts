import ReactGA from 'react-ga4'

// Analytics event types for type safety
export interface ComicEvent {
  comic_id: string
  comic_title: string
  comic_slug?: string
}

export interface ChapterEvent extends ComicEvent {
  chapter_id: string
  chapter_name: string
}

export interface SearchEvent {
  search_query: string
  results_count?: number
}

export interface AuthEvent {
  method: 'google' | 'email'
  action: 'login' | 'signup' | 'logout' | 'mobile_login'
}

export interface CategoryEvent {
  category: string
  page?: number
}

export interface AppDownloadEvent {
  platform: 'ios' | 'android'
  action: 'modal_opened' | 'apk_download' | 'direct_download'
  source: string
}

export interface AffiliateClickEvent {
  action: 'affiliate_link_click'
  source: string
  url?: string
}

// Initialize Google Analytics
export const initializeAnalytics = (): boolean => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

  if (!measurementId) {
    console.warn('Google Analytics: VITE_GA_MEASUREMENT_ID is not defined')
    return false
  }

  if (measurementId === 'G-XXXXXXXXXX') {
    console.warn(
      'Google Analytics: Please replace placeholder measurement ID with actual GA4 measurement ID'
    )
    return false
  }

  try {
    ReactGA.initialize(measurementId, {
      testMode: false,
      gtagOptions: {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure'
      }
    })

    return true
  } catch (error) {
    console.error('Google Analytics initialization error:', error)
    return false
  }
}

// Track page views
export const trackPageView = (path: string, title?: string): void => {
  try {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || getPageTitle(path)
    })
  } catch (error) {
    console.error('Google Analytics page view tracking error:', error)
  }
}

// Get meaningful page titles for Vietnamese URLs
const getPageTitle = (path: string): string => {
  const pathMappings: Record<string, string> = {
    '/': 'Trang chủ',
    '/truyen-moi': 'Truyện mới',
    '/truyen-moi-cap-nhat': 'Truyện mới cập nhật',
    '/truyen-nhanh': 'Truyện nhanh',
    '/truyen-noi-bat': 'Truyện nổi bật',
    '/truyen-hoan-thanh': 'Truyện hoàn thành',
    '/truyen-con-trai': 'Truyện con trai',
    '/truyen-con-gai': 'Truyện con gái',
    '/bang-xep-hang': 'Bảng xếp hạng',
    '/the-loai': 'Thể loại',
    '/tim-kiem': 'Tìm kiếm',
    '/lich-su-doc-truyen': 'Lịch sử đọc truyện',
    '/dang-nhap': 'Đăng nhập',
    '/dang-ky': 'Đăng ký',
    '/thong-tin-ca-nhan': 'Thông tin cá nhân',
    '/chinh-sach-bao-mat': 'Chính sách bảo mật',
    '/gioi-thieu-ung-dung': 'Giới thiệu ứng dụng'
  }

  // Check for exact matches first
  if (pathMappings[path]) {
    return pathMappings[path]
  }

  // Handle dynamic paths
  if (path.includes('/truyen-tranh/')) {
    return 'Chi tiết truyện'
  }
  if (path.includes('/tai-truyen/')) {
    return 'Tải truyện'
  }
  if (path.match(/\/truyen-tranh\/.*\/.*\/\d+/)) {
    return 'Đọc chương'
  }

  return 'MeTruyen+ - Đọc truyện chữ online'
}

// Comic-related event tracking
export const trackComicView = (comic: ComicEvent): void => {
  try {
    ReactGA.event('view_comic', {
      category: 'Comics',
      label: comic.comic_title,
      comic_id: comic.comic_id,
      comic_slug: comic.comic_slug
    })
  } catch (error) {
    console.error('Google Analytics comic view tracking error:', error)
  }
}

export const trackChapterRead = (chapter: ChapterEvent): void => {
  try {
    ReactGA.event('read_chapter', {
      category: 'Reading',
      label: `${chapter.comic_title} - ${chapter.chapter_name}`,
      comic_id: chapter.comic_id,
      chapter_id: chapter.chapter_id,
      comic_title: chapter.comic_title,
      chapter_name: chapter.chapter_name
    })
  } catch (error) {
    console.error('Google Analytics chapter read tracking error:', error)
  }
}

// Search event tracking
export const trackSearch = (search: SearchEvent): void => {
  try {
    ReactGA.event('search', {
      category: 'Search',
      label: search.search_query,
      search_term: search.search_query,
      results_count: search.results_count
    })
  } catch (error) {
    console.error('Google Analytics search tracking error:', error)
  }
}

// Authentication event tracking
export const trackAuth = (auth: AuthEvent): void => {
  try {
    ReactGA.event(auth.action, {
      category: 'Authentication',
      label: auth.method,
      method: auth.method
    })
  } catch (error) {
    console.error('Google Analytics auth tracking error:', error)
  }
}

// Category browsing event tracking
export const trackCategoryView = (category: CategoryEvent): void => {
  try {
    ReactGA.event('view_category', {
      category: 'Navigation',
      label: category.category,
      category_name: category.category,
      page_number: category.page
    })
  } catch (error) {
    console.error('Google Analytics category view tracking error:', error)
  }
}

// Download event tracking
export const trackDownload = (comic: ComicEvent & { chapter_id?: string }): void => {
  try {
    ReactGA.event('download_comic', {
      category: 'Downloads',
      label: comic.comic_title,
      comic_id: comic.comic_id,
      comic_title: comic.comic_title,
      chapter_id: comic.chapter_id
    })
  } catch (error) {
    console.error('Google Analytics download tracking error:', error)
  }
}

// App download event tracking
export const trackAppDownload = (appDownload: AppDownloadEvent): void => {
  try {
    ReactGA.event('app_download', {
      category: 'App Downloads',
      label: `${appDownload.platform} - ${appDownload.action}`,
      platform: appDownload.platform,
      action: appDownload.action,
      source: appDownload.source
    })
  } catch (error) {
    console.error('Google Analytics app download tracking error:', error)
  }
}

// Affiliate link click tracking
export const trackAffiliateClick = (affiliate: AffiliateClickEvent): void => {
  try {
    ReactGA.event('affiliate_link_click', {
      category: 'Affiliate',
      label: 'Shopee Affiliate Link',
      source: affiliate.source,
      url: affiliate.url,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Google Analytics affiliate click tracking error:', error)
  }
}

// Generic custom event tracking
export const trackCustomEvent = (
  action: string,
  category: string,
  label?: string,
  customParameters?: Record<string, any>
): void => {
  try {
    ReactGA.event(action, {
      category,
      label,
      ...customParameters
    })
  } catch (error) {
    console.error('Google Analytics custom event tracking error:', error)
  }
}

// Check if analytics is initialized and available
export const isAnalyticsAvailable = (): boolean => {
  return typeof ReactGA !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
}
