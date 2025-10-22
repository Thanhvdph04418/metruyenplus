import { useState, useEffect, useRef, useCallback } from 'react'

interface UseSimpleAutoScrollOptions {
  scrollSpeed?: number // Tốc độ cuộn (pixel per second)
  stopOnManualScroll?: boolean // Tự động tắt khi người dùng cuộn thủ công
}

export const useSimpleAutoScroll = ({
  scrollSpeed = 50, // Mặc định 50px/giây
  stopOnManualScroll = true
}: UseSimpleAutoScrollOptions = {}) => {
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isAutoScrollingRef = useRef(false)

  const startAutoScroll = useCallback(() => {
    console.log('Starting auto scroll...')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      isAutoScrollingRef.current = true
      console.log('Auto scrolling...')
      window.scrollBy({
        top: scrollSpeed / 10, // Chia cho 10 vì chạy 10 lần/giây
        behavior: 'smooth'
      })
      // Reset flag sau một khoảng thời gian dài hơn
      setTimeout(() => {
        isAutoScrollingRef.current = false
      }, 500)
    }, 100) // Chạy mỗi 100ms để smooth hơn
  }, [scrollSpeed])

  const stopAutoScroll = useCallback(() => {
    console.log('Stopping auto scroll...')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const toggleAutoScroll = useCallback(() => {
    console.log('Toggle auto scroll, current state:', isActive)
    setIsActive(prev => !prev)
  }, [isActive])

  // Phát hiện cuộn thủ công
  const handleScroll = useCallback(() => {
    if (!stopOnManualScroll || !isActive) return
    
    // Nếu cuộn không phải do auto scroll gây ra
    if (!isAutoScrollingRef.current) {
      console.log('Manual scroll detected, stopping auto scroll')
      setIsActive(false)
    } else {
      console.log('Auto scroll detected, ignoring')
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

  // Thêm event listener cho scroll
  useEffect(() => {
    if (isActive && stopOnManualScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isActive, stopOnManualScroll, handleScroll])

  return {
    isActive,
    toggleAutoScroll
  }
}

export default useSimpleAutoScroll
