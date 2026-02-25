const MobileNavigationControlsSkeleton = () => {
  return (
    <div className='flex sm:hidden items-center justify-between w-full gap-2 px-2 animate-pulse'>
      {/* Left controls skeleton */}
      <div className='flex items-center gap-2'>
        {/* Home button skeleton */}
        <div className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-700'>
          <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>

        {/* Comic info button skeleton */}
        <div className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-700'>
          <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>
      </div>

      {/* Chapter Navigation skeleton */}
      <div className='flex items-center gap-2'>
        {/* Previous button skeleton */}
        <div className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-700'>
          <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>

        {/* Chapter selector skeleton */}
        <div className='relative'>
          <div className='min-w-[120px] h-10 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-between'>
            <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1 mr-2' />
            <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
          </div>
        </div>

        {/* Next button skeleton */}
        <div className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-700'>
          <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>
      </div>

      {/* Refresh button skeleton */}
      <div className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-200 dark:bg-gray-700'>
        <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>
    </div>
  )
}

export default MobileNavigationControlsSkeleton
