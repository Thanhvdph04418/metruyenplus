import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'

interface CanonicalLinkProps {
  /**
   * Query parameters to include in canonical URL (e.g., ['type', 'q'])
   * Default: [] (no query params)
   */
  allowedParams?: string[]

  /**
   * Current query config object
   */
  queryConfig?: Record<string, string>

  /**
   * Total pages for pagination
   */
  totalPages?: number

  /**
   * Override pathname (default: current pathname)
   */
  pathname?: string
}

/**
 * CanonicalLink component
 *
 * Automatically generates proper canonical URLs and pagination links (prev/next)
 * to prevent Google Search Console "Duplicate without user-selected canonical" issues
 *
 * @example
 * ```tsx
 * // For genre pages with type parameter
 * <CanonicalLink allowedParams={['type']} queryConfig={queryConfig} totalPages={totalPages} />
 *
 * // For search pages with query parameter
 * <CanonicalLink allowedParams={['q']} queryConfig={queryConfig} totalPages={totalPages} />
 *
 * // For simple pages without query params
 * <CanonicalLink />
 * ```
 */
export const CanonicalLink: React.FC<CanonicalLinkProps> = ({
  allowedParams = [],
  queryConfig = {},
  totalPages = 1,
  pathname: overridePathname
}) => {
  const location = useLocation()
  const pathname = overridePathname || location.pathname

  // Generate canonical URL (always points to page 1)
  const canonicalUrl = useMemo(
    () => generateCanonicalUrl(pathname, allowedParams, queryConfig),
    [pathname, allowedParams, queryConfig]
  )

  // Calculate pagination
  const currentPage = useMemo(() => Number(queryConfig.page) || 1, [queryConfig.page])
  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < totalPages

  // Generate prev/next URLs
  const prevUrl = useMemo(
    () =>
      showPrevLink
        ? generatePaginationUrl(pathname, currentPage - 1, allowedParams, queryConfig)
        : null,
    [showPrevLink, currentPage, pathname, allowedParams, queryConfig]
  )

  const nextUrl = useMemo(
    () =>
      showNextLink
        ? generatePaginationUrl(pathname, currentPage + 1, allowedParams, queryConfig)
        : null,
    [showNextLink, currentPage, pathname, allowedParams, queryConfig, totalPages]
  )

  return (
    <Helmet>
      {/* Canonical URL - always points to page 1 to avoid duplicates */}
      <link rel='canonical' href={canonicalUrl} />

      {/* Pagination links for SEO */}
      {prevUrl && <link rel='prev' href={prevUrl} />}
      {nextUrl && <link rel='next' href={nextUrl} />}
    </Helmet>
  )
}

export default CanonicalLink
