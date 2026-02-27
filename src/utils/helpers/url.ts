/**
 * Build query string from object
 * @param params - Object with query parameters
 * @returns Query string (e.g., "?key=value&key2=value2")
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Parse query string to object
 * @param queryString - Query string (with or without leading "?")
 * @returns Object with parsed parameters
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  // Remove leading "?" if present
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString
  const params = new URLSearchParams(cleanQuery)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

/**
 * Update URL query parameters without navigation
 * @param params - Object with query parameters to update
 * @param replace - If true, replace current history entry instead of adding new one
 */
export const updateQueryParams = (params: Record<string, any>, replace: boolean = false): void => {
  const url = new URL(window.location.href)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    } else {
      url.searchParams.delete(key)
    }
  })

  if (replace) {
    window.history.replaceState({}, '', url.toString())
  } else {
    window.history.pushState({}, '', url.toString())
  }
}
