/**
 * Canonical URL utility for generating clean, SEO-friendly URLs
 * Helps prevent Google Search Console "Duplicate without user-selected canonical" issues
 */

const SITE_URL = 'https://tcomicclub.com'

// Query parameters that should be stripped from canonical URLs
const EXCLUDED_PARAMS = [
  'page', // Pagination - handled separately with rel prev/next
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid', // Facebook click ID
  'gclid', // Google click ID
  'ref', // Referrer tracking
  'source', // Generic source tracking
  '_ga' // Google Analytics
]

/**
 * Generate canonical URL for a page
 * @param pathname - The current pathname (e.g., /truyen-tranh/slug-123)
 * @param allowedParams - Query parameters to keep in canonical URL (e.g., ['type', 'q'])
 * @param currentParams - Current query parameters object
 * @returns Full canonical URL
 */
export function generateCanonicalUrl(
  pathname: string,
  allowedParams: string[] = [],
  currentParams: Record<string, string> = {}
): string {
  // Normalize pathname - remove trailing slashes and double slashes
  let cleanPath = pathname
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/\/$/, '') // Remove trailing slash

  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath
  }

  // Build query string with only allowed parameters
  const queryParts: string[] = []

  if (allowedParams.length > 0) {
    allowedParams.forEach((param) => {
      if (currentParams[param] && !EXCLUDED_PARAMS.includes(param)) {
        const value = encodeURIComponent(currentParams[param])
        queryParts.push(`${param}=${value}`)
      }
    })
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''

  return `${SITE_URL}${cleanPath}${queryString}`
}

/**
 * Generate pagination link URLs (for rel="prev" and rel="next")
 * @param pathname - The current pathname
 * @param page - Target page number
 * @param allowedParams - Query parameters to keep
 * @param currentParams - Current query parameters
 * @returns Full pagination URL
 */
export function generatePaginationUrl(
  pathname: string,
  page: number,
  allowedParams: string[] = [],
  currentParams: Record<string, string> = {}
): string {
  const cleanPath = pathname.replace(/\/+/g, '/').replace(/\/$/, '')

  const queryParts: string[] = []

  // Add page parameter
  queryParts.push(`page=${page}`)

  // Add other allowed parameters
  allowedParams.forEach((param) => {
    if (currentParams[param] && param !== 'page' && !EXCLUDED_PARAMS.includes(param)) {
      const value = encodeURIComponent(currentParams[param])
      queryParts.push(`${param}=${value}`)
    }
  })

  return `${SITE_URL}${cleanPath}?${queryParts.join('&')}`
}

/**
 * Check if current page is the first page (canonical page)
 * @param currentPage - Current page number or string
 * @returns True if it's the first page
 */
export function isFirstPage(currentPage: string | number | undefined): boolean {
  if (!currentPage) return true
  const pageNum = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage
  return pageNum <= 1 || isNaN(pageNum)
}

/**
 * Strip query parameters from URL for canonical
 * @param url - Full URL string
 * @param keepParams - Parameters to keep
 * @returns Clean URL
 */
export function stripQueryParams(url: string, keepParams: string[] = []): string {
  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)
    const newParams = new URLSearchParams()

    keepParams.forEach((param) => {
      const value = params.get(param)
      if (value !== null) {
        newParams.set(param, value)
      }
    })

    urlObj.search = newParams.toString()
    return urlObj.toString()
  } catch {
    // If URL parsing fails, return as is
    return url
  }
}

export default {
  generateCanonicalUrl,
  generatePaginationUrl,
  isFirstPage,
  stripQueryParams,
  SITE_URL
}
