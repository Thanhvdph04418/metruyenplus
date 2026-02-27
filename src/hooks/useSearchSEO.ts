import { useMemo } from 'react'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'

interface UseSearchSEOParams {
  queryConfig: any
  totalPages?: number
}

export const useSearchSEO = ({ queryConfig, totalPages = 1 }: UseSearchSEOParams) => {
  const searchTerm = queryConfig.q || ''
  const currentPage = useMemo(() => Number(queryConfig.page) || 1, [queryConfig.page])
  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < totalPages

  const canonicalUrl = useMemo(
    () => generateCanonicalUrl('/tim-kiem', ['q'], { q: searchTerm }),
    [searchTerm]
  )

  const prevUrl = useMemo(
    () =>
      showPrevLink
        ? generatePaginationUrl('/tim-kiem', currentPage - 1, ['q'], { q: searchTerm })
        : null,
    [showPrevLink, currentPage, searchTerm]
  )

  const nextUrl = useMemo(
    () =>
      showNextLink
        ? generatePaginationUrl('/tim-kiem', currentPage + 1, ['q'], { q: searchTerm })
        : null,
    [showNextLink, currentPage, searchTerm, totalPages]
  )

  const metaTags = useMemo(
    () => ({
      title: searchTerm ? `Tìm kiếm: ${searchTerm} - nettruyen` : 'Tìm truyện tranh online - nettruyen',
      description: searchTerm
        ? `Kết quả tìm kiếm cho "${searchTerm}" - Tìm thấy truyện tranh phù hợp với từ khóa`
        : 'Tìm truyện tranh - Tất cả truyện đều có thể tìm thấy tại nettruyen',
      canonicalUrl,
      prevUrl,
      nextUrl
    }),
    [searchTerm, canonicalUrl, prevUrl, nextUrl]
  )

  return metaTags
}
