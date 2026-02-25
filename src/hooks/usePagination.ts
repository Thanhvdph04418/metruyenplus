import { useState, useCallback, useMemo } from 'react'
import { calculatePagination, generatePageNumbers, paginateArray } from '@/utils/helpers'

export interface UsePaginationOptions {
  initialPage?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
}

/**
 * Hook for pagination state management
 * @param items - Array of items to paginate
 * @param options - Pagination options
 * @returns Pagination state and navigation functions
 */
export const usePagination = <T>(
  items: T[],
  options: UsePaginationOptions = {}
) => {
  const {
    initialPage = 1,
    itemsPerPage = 10,
    onPageChange,
  } = options

  const [currentPage, setCurrentPage] = useState(initialPage)

  const paginationInfo = useMemo(
    () => calculatePagination({
      currentPage,
      totalItems: items.length,
      itemsPerPage,
    }),
    [currentPage, items.length, itemsPerPage]
  )

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, paginationInfo.totalPages),
    [currentPage, paginationInfo.totalPages]
  )

  const paginatedItems = useMemo(
    () => paginateArray(items, currentPage, itemsPerPage),
    [items, currentPage, itemsPerPage]
  )

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > paginationInfo.totalPages) return
    setCurrentPage(page)
    onPageChange?.(page)
  }, [paginationInfo.totalPages, onPageChange])

  const goToNextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, paginationInfo.hasNextPage, goToPage])

  const goToPreviousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, paginationInfo.hasPreviousPage, goToPage])

  const goToFirstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])

  const goToLastPage = useCallback(() => {
    goToPage(paginationInfo.totalPages)
  }, [paginationInfo.totalPages, goToPage])

  return {
    paginatedItems,
    pageNumbers,
    ...paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  }
}
