const PaginationSkeleton = () => {
  return (
    <div className='mt-8 flex flex-wrap justify-center gap-1 gap-y-2 animate-pulse'>
      {/* Previous Button Skeleton */}
      <div className='rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 px-3 h-[34px] shadow-sm flex items-center justify-center'>
        <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>

      {/* Page Numbers Skeleton */}
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          className='mx-1 rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 px-3 h-[34px] shadow-sm flex items-center justify-center'
          style={{ width: index === 3 ? '40px' : '34px' }} // Middle item slightly wider to simulate current page
        >
          <div
            className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
              index === 3 ? 'bg-gray-400 dark:bg-gray-500 w-3' : 'w-2'
            }`}
          />
        </div>
      ))}

      {/* Dots Skeleton */}
      <div className='mx-1 rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 px-3 h-[34px] shadow-sm flex items-center justify-center'>
        <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full' />
      </div>

      {/* Last Page Skeleton */}
      <div className='mx-1 rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 px-3 h-[34px] shadow-sm flex items-center justify-center'>
        <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-4' />
      </div>

      {/* Next Button Skeleton */}
      <div className='rounded border border-gray-200 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 px-3 h-[34px] shadow-sm flex items-center justify-center'>
        <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>
    </div>
  )
}

export default PaginationSkeleton
