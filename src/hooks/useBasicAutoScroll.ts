import { useState, useEffect, useRef, useCallback } from 'react'

interface UseBasicAutoScrollOptions {
  scrollSpeed?: number // Tốc độ cuộn (pixel per second)
  stopOnManualScroll?: boolean // Tự động tắt khi người dùng cuộn thủ công
}

export const useBasicAutoScroll = ({
  scrollSpeed = 50, // Mặc định 50px/giây
  stopOnManualScroll = true
}: UseBasicAutoScrollOptions = {}) => {
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)
  const isAutoScrollingRef = useRef(false)
  const lastScrollTimeRef = useRef(0)

  const startAutoScroll = useCallback(() => {
    console.log('Starting auto scroll...')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animate = () => {
      isAutoScrollingRef.current = true
      console.log('Auto scrolling...')
      window.scrollBy({
        top: scrollSpeed / 60, // Chia cho 60 vì chạy 60 lần/giây
        behavior: 'smooth'
      })
      // Reset flag sau một khoảng thời gian
      setTimeout(() => {
        isAutoScrollingRef.current = false
      }, 20)
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [scrollSpeed])

  const stopAutoScroll = useCallback(() => {
    console.log('Stopping auto scroll...')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const toggleAutoScroll = useCallback(() => {
    console.log('Toggle auto scroll, current state:', isActive)
    setIsActive(prev => !prev)
  }, [isActive])

  // Phát hiện cuộn thủ công bằng wheel event
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!stopOnManualScroll || !isActive) return
    
    // Nếu cuộn không phải do auto scroll gây ra
    if (!isAutoScrollingRef.current) {
      console.log('Manual wheel detected, stopping auto scroll')
      setIsActive(false)
    }
  }, [stopOnManualScroll, isActive])

  // Phát hiện cuộn thủ công bằng touch event
  const handleTouchStart = useCallback(() => {
    if (!stopOnManualScroll || !isActive) return
    
    // Nếu cuộn không phải do auto scroll gây ra
    if (!isAutoScrollingRef.current) {
      console.log('Manual touch detected, stopping auto scroll')
      setIsActive(false)
    }
  }, [stopOnManualScroll, isActive])

  // Effect để start/stop auto scroll
  useEffect(() => {
    if (isActive) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }

    return () => {
      stopAutoScroll()
    }
  }, [isActive, startAutoScroll, stopAutoScroll])

  // Thêm event listeners cho phát hiện cuộn thủ công
  useEffect(() => {
    if (isActive && stopOnManualScroll) {
      // Lắng nghe wheel event (scroll wheel)
      window.addEventListener('wheel', handleWheel, { passive: true })
      // Lắng nghe touch events (mobile)
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      
      return () => {
        window.removeEventListener('wheel', handleWheel)
        window.removeEventListener('touchstart', handleTouchStart)
      }
    }
  }, [isActive, stopOnManualScroll, handleWheel, handleTouchStart])

  return {
    isActive,
    toggleAutoScroll
  }
}

export default useBasicAutoScroll
