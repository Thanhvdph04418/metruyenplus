import { useEffect } from 'react'
import classNames from 'classnames'

export type ComicMessageType = 'success' | 'error' | 'info' | 'warning'

export interface ComicMessageProps {
  type: ComicMessageType
  message: string
  title?: string
  onDismiss?: () => void
  duration?: number
  visible?: boolean
}

const VARIANTS: Record<
  ComicMessageType,
  {
    label: string
    borderClass: string
    bgClass: string
    labelClass: string
  }
> = {
  success: {
    label: 'Xong!',
    borderClass:
      'border-emerald-500 dark:border-emerald-400 shadow-emerald-200/50 dark:shadow-emerald-900/30',
    bgClass: 'bg-emerald-200 dark:bg-emerald-800',
    labelClass: 'text-emerald-700 dark:text-emerald-300'
  },
  error: {
    label: 'Lỗi!',
    borderClass: 'border-rose-500 dark:border-rose-400 shadow-rose-200/50 dark:shadow-rose-900/30',
    bgClass: 'bg-rose-200 dark:bg-rose-800',
    labelClass: 'text-rose-700 dark:text-rose-300'
  },
  info: {
    label: 'Thông báo',
    borderClass:
      'border-primary dark:border-primary shadow-orange-200/50 dark:shadow-orange-900/30',
    bgClass: 'bg-orange-200 dark:bg-orange-800',
    labelClass: 'text-primary dark:text-primary'
  },
  warning: {
    label: 'Chú ý!',
    borderClass:
      'border-amber-500 dark:border-amber-400 shadow-amber-200/50 dark:shadow-amber-900/30',
    bgClass: 'bg-amber-200 dark:bg-amber-800',
    labelClass: 'text-amber-800 dark:text-amber-300'
  }
}

/**
 * ComicMessage - Message/toast UI with manga/comic style
 * Speech bubble feel, bold borders, Bangers font for labels
 */
export const ComicMessage = ({
  type,
  message,
  title,
  onDismiss,
  duration = 4000,
  visible = true
}: ComicMessageProps) => {
  const v = VARIANTS[type]
  const displayTitle = title ?? v.label

  useEffect(() => {
    if (duration > 0 && onDismiss) {
      const t = setTimeout(onDismiss, duration)
      return () => clearTimeout(t)
    }
  }, [duration, onDismiss])

  if (!visible) return null

  return (
    <div
      role='alert'
      className={classNames(
        'relative rounded-xl border-2 shadow-md min-w-[240px] max-w-[85vw] sm:min-w-[260px] sm:max-w-[360px]',
        'animate-[fadeIn_0.3s_ease-out]',
        v.borderClass,
        v.bgClass
      )}
      style={{ fontFamily: 'inherit' }}
    >
      {/* Speech bubble "tail" - comic style */}
      <div
        className={classNames(
          'absolute -bottom-1 left-5 w-2.5 h-2.5 rotate-45',
          type === 'success' &&
            'bg-emerald-200 dark:bg-emerald-800 border-emerald-500 dark:border-emerald-400 border-r-2 border-b-2',
          type === 'error' &&
            'bg-rose-200 dark:bg-rose-800 border-rose-500 dark:border-rose-400 border-r-2 border-b-2',
          type === 'info' &&
            'bg-orange-200 dark:bg-orange-800 border-primary border-r-2 border-b-2',
          type === 'warning' &&
            'bg-amber-200 dark:bg-amber-800 border-amber-500 dark:border-amber-400 border-r-2 border-b-2'
        )}
        aria-hidden
      />

      <div className='relative px-3 py-2.5 pr-4 sm:px-4 sm:py-3 sm:pr-5'>
        <div className='flex items-start gap-2 sm:gap-2.5'>
          {/* Comic-style label with Bangers font */}
          <div
            className={classNames(
              'font-title text-base sm:text-xl tracking-wide flex-shrink-0',
              v.labelClass
            )}
            style={{ fontFamily: 'Bangers, Bangers Fallback, cursive' }}
          >
            {displayTitle}
          </div>
          <p className='flex-1 font-comic text-xs sm:text-base text-gray-800 dark:text-gray-200 pt-0.5 leading-snug'>
            {message}
          </p>
          {onDismiss && (
            <button
              type='button'
              onClick={onDismiss}
              className='flex-shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400'
              aria-label='Đóng'
            >
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
