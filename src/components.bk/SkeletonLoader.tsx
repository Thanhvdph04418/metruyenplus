interface SkeletonLoaderProps {
  variant?: 'card' | 'hotCard' | 'text' | 'title' | 'avatar'
  className?: string
}

const SkeletonLoader = ({ variant = 'card', className = '' }: SkeletonLoaderProps) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className='w-full h-[240px] xl:h-[220px] bg-gray-200 dark:bg-gray-700 aspect-comic'></div>
            <div className='mt-2 space-y-2'>
              <div className='skeleton skeleton-title w-3/4'></div>
              <div className='skeleton skeleton-text w-1/2'></div>
              <div className='skeleton skeleton-text w-2/3'></div>
            </div>
          </div>
        )

      case 'hotCard':
        return (
          <div
            className={`animate-pulse bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 h-[360px] sm:h-[380px] md:h-[400px] ${className}`}
          >
            <div className='w-full h-[260px] sm:h-[280px] md:h-[300px] bg-gray-200 dark:bg-gray-700 aspect-hot-comic'></div>
            <div className='p-4 space-y-2'>
              <div className='skeleton skeleton-title w-4/5'></div>
              <div className='skeleton skeleton-text w-3/5'></div>
            </div>
          </div>
        )

      case 'avatar':
        return (
          <div
            className={`w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ${className}`}
          ></div>
        )

      case 'title':
        return <div className={`skeleton skeleton-title animate-pulse ${className}`}></div>

      case 'text':
      default:
        return <div className={`skeleton skeleton-text animate-pulse ${className}`}></div>
    }
  }

  return getSkeletonContent()
}

export default SkeletonLoader
