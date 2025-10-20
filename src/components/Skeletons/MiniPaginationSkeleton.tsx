const MiniPaginationSkeleton = () => {
  return (
    <div className='flex items-center gap-2 animate-pulse'>
      {/* Page Info Skeleton */}
      <span className='text-black dark:text-white text-lg flex items-center gap-1'>
        <div className='h-5 bg-gray-300 dark:bg-gray-600 rounded w-4' />
        <span className='text-gray-400'>/</span>
        <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-6' />
      </span>

      {/* Navigation Buttons Skeleton */}
      <div className='flex items-center gap-1'>
        {/* Previous Button Skeleton */}
        <div className='py-2 px-3 rounded-md border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 flex justify-center'>
          <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>

        {/* Next Button Skeleton */}
        <div className='py-2 px-3 rounded-md border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 flex justify-center'>
          <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>
      </div>
    </div>
  )
}

export default MiniPaginationSkeleton
