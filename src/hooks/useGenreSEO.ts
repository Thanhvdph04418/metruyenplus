import { useMemo } from 'react'
import { useQueryParams } from '@/hooks'
import { generateCanonicalUrl, generatePaginationUrl } from '@/utils/canonicalUrl'
import { dataGenres } from '@/types/data'

interface UseGenreSEOParams {
  currentGenre: dataGenres[0] | undefined
  type: string
  totalPages?: number
}

export const useGenreSEO = ({ currentGenre, type, totalPages }: UseGenreSEOParams) => {
  const { page } = useQueryParams()
  const currentPage = Number(page) || 1

  const canonicalUrl = useMemo(() => generateCanonicalUrl('/the-loai', ['type'], { type }), [type])

  const showPrevLink = currentPage > 1
  const showNextLink = currentPage < (totalPages || 1)

  const prevUrl = useMemo(
    () =>
      showPrevLink ? generatePaginationUrl('/the-loai', currentPage - 1, ['type'], { type }) : null,
    [showPrevLink, currentPage, type]
  )

  const nextUrl = useMemo(
    () =>
      showNextLink ? generatePaginationUrl('/the-loai', currentPage + 1, ['type'], { type }) : null,
    [showNextLink, currentPage, type, totalPages]
  )

  const metaTags = useMemo(
    () => ({
      title: `Truyện Thể loại ${currentGenre?.name || ''} - TComic`,
      description: `Truyện Thể loại ${currentGenre?.name || ''} - ${
        currentGenre?.description || ''
      }`,
      canonicalUrl,
      prevUrl,
      nextUrl
    }),
    [currentGenre, canonicalUrl, prevUrl, nextUrl]
  )

  return metaTags
}
