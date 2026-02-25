/**
 * Format large numbers using compact notation (e.g., 1500 -> "1.5K", 1000000 -> "1M")
 * This is an alias for formatNumber for consistency
 * @param num - Number to format
 * @returns Formatted string
 */
export const formatCompactNumber = (num: number): string => {
  if (num === null || num === undefined) return '0'

  if (num < 1000) return num.toString()

  const units = ['', 'K', 'M', 'B']
  const order = Math.floor(Math.log10(num) / 3)
  const unitName = units[order]
  const value = num / Math.pow(1000, order)

  // Format to 1 decimal place if there's a decimal part
  return value.toFixed(value % 1 === 0 ? 0 : 1) + unitName
}

/**
 * Format number with thousand separators (e.g., 1000000 -> "1,000,000")
 * @param num - Number to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString('vi-VN')
}

/**
 * Format view count with Vietnamese text (e.g., "1.5K lượt xem")
 * @param views - Number of views
 * @returns Formatted view count string
 */
export const formatViewCount = (views: number): string => {
  return `${formatCompactNumber(views)} lượt xem`
}

/**
 * Format chapter count (e.g., "123 chương")
 * @param count - Number of chapters
 * @returns Formatted chapter count string
 */
export const formatChapterCount = (count: number): string => {
  return `${count} chương`
}

// Migrated from existing formatNumber.ts for backward compatibility
/**
 * Format number using compact notation
 * @deprecated Use formatCompactNumber instead for consistency
 */
export const formatNumber = formatCompactNumber

/**
 * Format number using Intl.NumberFormat compact notation
 * @param number - Number to format
 * @returns Formatted string (e.g., "1.5K")
 */
export const formatNumberSocial = (number: number) =>
  Intl.NumberFormat('en', { notation: 'compact' }).format(number)

/**
 * Format currency with thousand separators
 * @param currency - Currency amount
 * @returns Formatted currency string (e.g., "1.000.000")
 */
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}
