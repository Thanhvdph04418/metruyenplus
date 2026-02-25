const BottomNavigationSkeleton = () => {
  return (
    <div className='flex items-center justify-center gap-4 sm:gap-6 my-8 sm:my-12 px-4 animate-pulse'>
      {/* Previous Chapter Button Skeleton */}
      <div className='group flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 h-11 sm:h-14 bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-2xl shadow'>
        <div className='w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded' />
        <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 sm:w-20' />
      </div>

      {/* Next Chapter Button Skeleton */}
      <div className='group flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 h-11 sm:h-14 bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-2xl shadow'>
        <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 sm:w-20' />
        <div className='w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>
    </div>
  )
}

export default BottomNavigationSkeleton
