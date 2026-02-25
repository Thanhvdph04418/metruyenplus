import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

interface AutoScrollButtonProps {
  isActive: boolean
  isPaused: boolean
  onToggle: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  className?: string
}

const AutoScrollButton: React.FC<AutoScrollButtonProps> = ({
  isActive,
  isPaused,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Nếu đang cuộn tự động, luôn hiển thị
      if (isActive && !isPaused) {
        setIsVisible(true)
        return
      }
      
      // Nếu không cuộn tự động, ẩn khi scroll xuống, hiện khi scroll lên
      if (currentScrollY > lastScrollY) {
        // Scroll xuống - ẩn
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scroll lên - hiển thị
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isActive, isPaused, lastScrollY])

  return (
    <button
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classNames(
        'group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95',
        {
          'opacity-100 translate-y-0': isVisible,
          'opacity-0 translate-y-4 pointer-events-none': !isVisible
        },
        {
          'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25': isActive && !isPaused,
          'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/25': isActive && isPaused,
          'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-gray-500/25': !isActive
        },
        className
      )}
      title={isActive ? (isPaused ? 'Tiếp tục cuộn tự động' : 'Tạm dừng cuộn tự động') : 'Bật cuộn tự động'}
    >
      {isActive ? (
        isPaused ? (
          // Play icon khi đang tạm dừng
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        ) : (
          // Pause icon khi đang chạy
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        )
      ) : (
        // Play icon khi chưa bật
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
      )}
      
      {/* Pulse animation khi đang chạy */}
      {isActive && !isPaused && (
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
      )}
    </button>
  )
}

export default AutoScrollButton
