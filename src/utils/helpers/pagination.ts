export interface PaginationConfig {
  currentPage: number
  totalItems: number
  itemsPerPage: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Calculate pagination information
 * @param config - Pagination configuration
 * @returns Pagination information object
 */
export const calculatePagination = (config: PaginationConfig): PaginationInfo => {
  const { currentPage, totalItems, itemsPerPage } = config

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  }
}

/**
 * Generate page numbers for pagination UI
 * @param currentPage - Current active page
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of visible page buttons (default: 5)
 * @returns Array of page numbers and ellipsis markers
 */
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | 'ellipsis')[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []
  const half = Math.floor(maxVisible / 2)

  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, currentPage + half)

  // Adjust if we're near the start or end
  if (currentPage <= half) {
    end = maxVisible
  } else if (currentPage >= totalPages - half) {
    start = totalPages - maxVisible + 1
  }

  // Always show first page
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('ellipsis')
  }

  // Add visible page numbers
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Always show last page
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return pages
}

/**
 * Get slice of items for current page
 * @param items - Array of items to paginate
 * @param currentPage - Current page number
 * @param itemsPerPage - Number of items per page
 * @returns Slice of items for current page
 */
export const paginateArray = <T>(items: T[], currentPage: number, itemsPerPage: number): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return items.slice(startIndex, endIndex)
}
