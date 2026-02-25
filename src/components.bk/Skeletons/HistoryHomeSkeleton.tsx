const HistoryHomeSkeleton = () => {
  return (
    <>
      {/* Mobile History Skeleton */}
      <div className='block sm:hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse' />
          </div>
          <div className='flex items-center gap-1'>
            <div className='h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          </div>
        </div>
        <div
          className='grid grid-cols-4 min-[375px]:grid-cols-5 min-[480px]:grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-1'
          style={{ minHeight: '120px' }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className='relative'>
              <div className='w-full h-[100px] sm:h-[120px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse' />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop History Skeleton */}
      <div className='hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse' />
          </div>
          <div className='flex items-center gap-1'>
            <div className='h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          </div>
        </div>
        <div className='grid grid-cols-6 gap-3' style={{ minHeight: '280px' }}>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className='relative'>
              {/* Image Container */}
              <div className='w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
              {/* Content Section */}
              <div className='mt-2 flex flex-col space-y-2'>
                {/* Title */}
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse' />
                {/* Date */}
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse' />
                {/* Chapter */}
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default HistoryHomeSkeleton
