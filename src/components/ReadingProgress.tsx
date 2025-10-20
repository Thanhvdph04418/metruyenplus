import { useState, useEffect } from 'react'

/**
 * ReadingProgress - A component that shows a progress bar at the top of the page
 * to indicate how far the user has scrolled through the content
 */
export default function ReadingProgress() {
  const [width, setWidth] = useState(0)

  const scrollHeight = () => {
    const element = document.documentElement
    const scrollTop = element.scrollTop || document.body.scrollTop
    const scrollHeight = element.scrollHeight || document.body.scrollHeight
    const clientHeight = element.clientHeight

    // Calculate how far the user has scrolled as a percentage
    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100
    return Math.min(scrolled, 100)
  }

  const updateProgress = () => {
    // Only update if we've scrolled at least 50px to avoid unnecessary updates
    if (document.documentElement.scrollTop > 50) {
      setWidth(scrollHeight())
    } else {
      setWidth(0)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  return (
    <div
      className='fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-200 ease-out'
      style={{ width: `${width}%`, opacity: width > 0 ? 1 : 0 }}
      role='progressbar'
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
