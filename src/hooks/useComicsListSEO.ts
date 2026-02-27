import { useMemo } from 'react'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'
import PATH from '@/utils/path'

interface UseComicsListSEOParams {
  pathname: string
  title: string
  queryConfig: any
  totalPages?: number
}

export const useComicsListSEO = ({
  pathname,
  title,
  queryConfig,
  totalPages
}: UseComicsListSEOParams) => {
  const isTopAndNew = useMemo(
    () => pathname.includes(PATH.new) || pathname.includes(PATH.top),
    [pathname]
  )

  const currentPage = useMemo(() => Number(queryConfig.page) || 1, [queryConfig.page])
  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < (totalPages || 1)

  const canonicalUrl = useMemo(() => {
    const allowedParams = isTopAndNew && queryConfig.status ? ['status'] : []
    return generateCanonicalUrl(pathname, allowedParams, queryConfig as Record<string, string>)
  }, [pathname, isTopAndNew, queryConfig])

  const prevUrl = useMemo(() => {
    if (!showPrevLink) return null
    const allowedParams = isTopAndNew && queryConfig.status ? ['status'] : []
    return generatePaginationUrl(
      pathname,
      currentPage - 1,
      allowedParams,
      queryConfig as Record<string, string>
    )
  }, [showPrevLink, currentPage, pathname, isTopAndNew, queryConfig])

  const nextUrl = useMemo(() => {
    if (!showNextLink) return null
    const allowedParams = isTopAndNew && queryConfig.status ? ['status'] : []
    return generatePaginationUrl(
      pathname,
      currentPage + 1,
      allowedParams,
      queryConfig as Record<string, string>
    )
  }, [showNextLink, currentPage, pathname, isTopAndNew, queryConfig, totalPages])

  return {
    title: `Truyện tranh ${title} online - nettruyen`,
    description: `Truyện tranh ${title} online - Tất cả truyện ${title} có thể tìm thấy tại nettruyen`,
    canonicalUrl,
    prevUrl,
    nextUrl
  }
}
