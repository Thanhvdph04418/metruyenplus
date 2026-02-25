import { useReadingProgress } from '@/hooks/useReadingProgress'

/**
 * Reading progress bar component
 * Displays a horizontal progress bar at the top of the page
 * indicating how far the user has scrolled through the chapter
 */
const ReadingProgressBar = () => {
  const progress = useReadingProgress()

  return (
    <div className='fixed top-0 left-0 w-full h-1 bg-zinc-800 z-50'>
      <div
        className='h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-150 ease-out'
        style={{ width: `${progress}%` }}
        role='progressbar'
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${progress}%`}
      />
    </div>
  )
}

export default ReadingProgressBar
