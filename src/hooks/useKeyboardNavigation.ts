import { useEffect, useCallback, useRef } from 'react'

interface KeyboardNavigationConfig {
  onPrevious: () => void
  onNext: () => void
  onToggleChapterList?: () => void
  onEscape?: () => void
  onHome?: () => void
  disabled?: boolean
  enableDebug?: boolean
}

export const useKeyboardNavigation = (config: KeyboardNavigationConfig) => {
  const {
    onPrevious,
    onNext,
    onToggleChapterList,
    onEscape,
    onHome,
    disabled = false,
    enableDebug = false
  } = config

  const lastKeyPressRef = useRef<number>(0)
  const DEBOUNCE_DELAY = 300 // Prevent rapid key presses

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if disabled or if user is typing in an input
      if (disabled) return

      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Debounce rapid key presses
      const now = Date.now()
      if (now - lastKeyPressRef.current < DEBOUNCE_DELAY) {
        event.preventDefault()
        return
      }

      let handled = false

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault()
          onPrevious()
          handled = true
          break

        case 'ArrowRight':
        case 'd':
        case 'D':
        case ' ': // Space bar
          event.preventDefault()
          onNext()
          handled = true
          break

        case 'ArrowUp':
          if (onToggleChapterList) {
            event.preventDefault()
            onToggleChapterList()
            handled = true
          }
          break

        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
            handled = true
          }
          break

        case 'h':
        case 'H':
          if (onHome) {
            event.preventDefault()
            onHome()
            handled = true
          }
          break

        default:
          break
      }

      if (handled) {
        lastKeyPressRef.current = now

        if (enableDebug) {
          console.log(`Keyboard navigation: ${event.key} pressed`)
        }
      }
    },
    [disabled, onPrevious, onNext, onToggleChapterList, onEscape, onHome, enableDebug]
  )

  useEffect(() => {
    if (!disabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, disabled])

  // Return keyboard shortcut info for help display
  return {
    shortcuts: {
      navigation: [
        { keys: ['←', 'A'], description: 'Previous chapter' },
        { keys: ['→', 'D', 'Space'], description: 'Next chapter' },
        { keys: ['↑'], description: 'Toggle chapter list' },
        { keys: ['H'], description: 'Go to home' },
        { keys: ['Esc'], description: 'Close modals/lists' }
      ]
    }
  }
}

// Hook for managing keyboard shortcuts help display
export const useKeyboardShortcutsHelp = () => {
  const shortcuts = [
    { keys: ['←', 'A'], description: 'Chương trước', category: 'navigation' },
    { keys: ['→', 'D', 'Space'], description: 'Chương sau', category: 'navigation' },
    { keys: ['↑'], description: 'Mở/đóng danh sách chương', category: 'navigation' },
    { keys: ['H'], description: 'Về trang chủ', category: 'navigation' },
    { keys: ['Esc'], description: 'Đóng popup/danh sách', category: 'ui' }
  ]

  const getFormattedKeys = (keys: string[]) => {
    return keys.join(' hoặc ')
  }

  return { shortcuts, getFormattedKeys }
}
