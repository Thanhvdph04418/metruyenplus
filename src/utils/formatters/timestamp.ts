import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

/**
 * Format timestamp to relative time (e.g., "2 giờ trước")
 * @param timestamp - Date string or Date object
 * @returns Formatted relative time string in Vietnamese
 */
export const formatRelativeTime = (timestamp: string | Date): string => {
  return dayjs(timestamp).fromNow()
}

/**
 * Format timestamp to full date (e.g., "08/02/2026 14:30")
 * @param timestamp - Date string or Date object
 * @param format - Custom format string (default: 'DD/MM/YYYY HH:mm')
 * @returns Formatted date string
 */
export const formatFullDate = (
  timestamp: string | Date,
  format: string = 'DD/MM/YYYY HH:mm'
): string => {
  return dayjs(timestamp).format(format)
}

/**
 * Format timestamp to date only (e.g., "08/02/2026")
 * @param timestamp - Date string or Date object
 * @returns Formatted date string
 */
export const formatDateOnly = (timestamp: string | Date): string => {
  return dayjs(timestamp).format('DD/MM/YYYY')
}

/**
 * Check if timestamp is today
 * @param timestamp - Date string or Date object
 * @returns True if timestamp is today, false otherwise
 */
export const isToday = (timestamp: string | Date): boolean => {
  return dayjs(timestamp).isSame(dayjs(), 'day')
}
