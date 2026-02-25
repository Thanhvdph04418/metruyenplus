import { useState, useEffect } from 'react'

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

/**
 * Custom hook to track window dimensions
 * Returns current window width and height, updating on resize
 */
export const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<WindowSize>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away to get initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures effect runs only on mount

  return size
}
