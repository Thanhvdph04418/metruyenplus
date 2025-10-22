import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAutoScrollOptions {
  scrollSpeed?: number // Tốc độ cuộn (pixel per second)
  enabled?: boolean // Có bật tính năng này không
  pauseOnHover?: boolean // Tạm dừng khi hover
  pauseOnClick?: boolean // Tạm dừng khi click
  stopOnManualScroll?: boolean // Tự động tắt khi người dùng cuộn thủ công
}

export const useAutoScroll = ({
  scrollSpeed = 50, // Mặc định 50px/giây
  enabled = false,
  pauseOnHover = true,
  pauseOnClick = true,
  stopOnManualScroll = true
}: UseAutoScrollOptions = {}) => {
  const [isActive, setIsActive] = useState(enabled)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringRef = useRef(false)
  const lastScrollTimeRef = useRef(0)
  const isAutoScrollingRef = useRef(false)

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (!isPaused && !isHoveringRef.current) {
        isAutoScrollingRef.current = true
        console.log('Auto scrolling...')
        window.scrollBy({
          top: scrollSpeed / 10, // Chia cho 10 vì chạy 10 lần/giây
          behavior: 'smooth'
        })
        // Reset flag sau một khoảng thời gian ngắn
        setTimeout(() => {
          isAutoScrollingRef.current = false
        }, 200)
      }
    }, 100) // Chạy mỗi 100ms để smooth hơn
  }, [scrollSpeed, isPaused])

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const toggleAutoScroll = useCallback(() => {
    setIsActive(prev => {
      console.log('Auto scroll toggled:', !prev)
      return !prev
    })
  }, [])

  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeAutoScroll = useCallback(() => {
    setIsPaused(false)
  }, [])

  // Xử lý hover events
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      isHoveringRef.current = true
    }
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      isHoveringRef.current = false
    }
  }, [pauseOnHover])

  // Xử lý click events
  const handleClick = useCallback(() => {
    if (pauseOnClick) {
      pauseAutoScroll()
      // Tự động resume sau 2 giây
      setTimeout(() => {
        resumeAutoScroll()
      }, 2000)
    }
  }, [pauseOnClick, pauseAutoScroll, resumeAutoScroll])

  // Phát hiện cuộn thủ công
  const handleScroll = useCallback(() => {
    if (!stopOnManualScroll || !isActive) return
    
    const now = Date.now()
    lastScrollTimeRef.current = now
    
    // Nếu cuộn không phải do auto scroll gây ra
    if (!isAutoScrollingRef.current) {
      // Tắt auto scroll
      setIsActive(false)
    }
  }, [stopOnManualScroll, isActive])

  // Effect để start/stop auto scroll
  useEffect(() => {
    if (isActive && !isPaused) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }

    return () => {
      stopAutoScroll()
    }
  }, [isActive, isPaused, startAutoScroll, stopAutoScroll])

  // Thêm event listener cho scroll
  useEffect(() => {
    if (isActive && stopOnManualScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isActive, stopOnManualScroll, handleScroll])

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopAutoScroll()
    }
  }, [stopAutoScroll])

  return {
    isActive,
    isPaused,
    toggleAutoScroll,
    pauseAutoScroll,
    resumeAutoScroll,
    handleMouseEnter,
    handleMouseLeave,
    handleClick
  }
}

export default useAutoScroll
