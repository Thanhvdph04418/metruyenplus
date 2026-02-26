const HistoryHomeSkeleton = () => {
  return (
    <>
      {/* Mobile History Skeleton - Match HistoryMobile: block xl:hidden */}
      <div className='block xl:hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6'>
        <div className='flex items-center justify-between mb-4 px-0'>
          <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse' />
          <div className='flex items-center gap-1'>
            <div className='h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          </div>
        </div>
        <div className='flex gap-3 overflow-x-auto pb-2 hide-horizontal-scrollbar' style={{ minHeight: '200px' }}>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className='flex-shrink-0 w-[120px]'>
              <div className='w-full h-[150px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse' />
              <div className='mt-2 space-y-1'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse' />
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop History Skeleton - Match HistoryDesktop: hidden xl:block */}
      <div className='hidden xl:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse' />
          <div className='flex items-center gap-1'>
            <div className='h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          </div>
        </div>
        <div className='flex gap-4 overflow-x-auto pb-2 hide-horizontal-scrollbar' style={{ minHeight: '280px' }}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className='flex-shrink-0 w-[180px]'>
              {/* Image Container */}
              <div className='w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
              {/* Content Section */}
              <div className='mt-3 flex flex-col space-y-2'>
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
