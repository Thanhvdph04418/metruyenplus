import { useEffect, useCallback } from 'react'

interface UseClickToScrollOptions {
  scrollAmount?: number // Số pixel cuộn xuống mỗi lần click
  enabled?: boolean // Có bật tính năng này không
  excludeElements?: string[] // Các selector của elements không nên trigger scroll
}

export const useClickToScroll = ({
  scrollAmount = 300, // Mặc định cuộn xuống 300px
  enabled = true,
  excludeElements = ['button', 'a', 'input', 'textarea', 'select', '[role="button"]']
}: UseClickToScrollOptions = {}) => {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return

      // Kiểm tra xem element được click có nằm trong danh sách loại trừ không
      const target = event.target as HTMLElement
      const isExcluded = excludeElements.some(selector => {
        if (selector.startsWith('[') && selector.endsWith(']')) {
          // Xử lý attribute selector như [role="button"]
          const attr = selector.slice(1, -1).split('=')[0]
          const value = selector.slice(1, -1).split('=')[1]?.replace(/"/g, '')
          return target.getAttribute(attr) === value
        } else {
          // Xử lý tag selector như button, a, input
          return target.tagName.toLowerCase() === selector.toLowerCase() || 
                 target.closest(selector) !== null
        }
      })

      if (isExcluded) return

      // Chỉ cuộn xuống khi chạm vào màn hình
      // Cuộn với smooth behavior
      window.scrollBy({
        top: scrollAmount, // Luôn cuộn xuống
        behavior: 'smooth'
      })
    },
    [enabled, scrollAmount, excludeElements]
  )

  useEffect(() => {
    if (!enabled) return

    // Thêm event listener
    document.addEventListener('click', handleClick)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [handleClick, enabled])

  return {
    // Có thể return các function để control từ bên ngoài nếu cần
    enable: () => {},
    disable: () => {}
  }
}

export default useClickToScroll
