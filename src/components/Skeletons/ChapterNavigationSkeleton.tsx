const ChapterNavigationSkeleton = () => {
  return (
    <div className='flex items-center gap-1.5 xs:gap-2 py-1.5 xs:py-2 animate-pulse'>
      {/* Previous Chapter Button Skeleton */}
      <div className='flex items-center justify-center w-7 xs:w-9 h-7 xs:h-9 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-200 dark:bg-gray-700'>
        <div className='w-4 xs:w-5 h-4 xs:h-5 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>

      {/* Chapter Selector Skeleton */}
      <div className='relative'>
        <div className='min-w-[120px] xs:min-w-[140px] h-8 xs:h-9 px-2 xs:px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-between'>
          <div className='h-3 xs:h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1 mr-2' />
          <div className='w-3 xs:w-4 h-3 xs:h-4 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>
      </div>

      {/* Next Chapter Button Skeleton */}
      <div className='flex items-center justify-center w-7 xs:w-9 h-7 xs:h-9 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-200 dark:bg-gray-700'>
        <div className='w-4 xs:w-5 h-4 xs:h-5 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>
    </div>
  )
}

export default ChapterNavigationSkeleton
