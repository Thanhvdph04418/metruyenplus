const CommentsListSkeleton = () => {
  return (
    <div className='w-full h-full max-w-[1000px] mx-auto px-2 sm:px-4'>
      <div className='border dark:border-gray-500 rounded-lg shadow-sm bg-white dark:bg-gray-800 animate-pulse'>
        {/* Header Skeleton */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border-b dark:border-gray-500'>
          <div className='flex items-center justify-between w-full sm:w-auto gap-2'>
            {/* Title and count skeleton */}
            <div className='flex items-center gap-1.5'>
              <div className='h-5 bg-gray-300 dark:bg-gray-600 rounded w-20' />
              <div className='h-4 bg-gray-400 dark:bg-gray-500 rounded w-12' />
            </div>

            {/* Desktop pagination skeleton */}
            <div className='hidden sm:flex items-center gap-1.5'>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-12' />
              <div className='flex items-center gap-1'>
                <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded border' />
                <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded border' />
              </div>
            </div>
          </div>

          {/* Mobile tabs skeleton */}
          <div className='w-full mt-2 sm:hidden'>
            <div className='grid grid-cols-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-full gap-1'>
              <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded-full' />
              <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded-full' />
            </div>
          </div>

          {/* Desktop filter skeleton */}
          <div className='hidden sm:flex items-center gap-4'>
            <div className='flex items-center border dark:border-gray-600 rounded-lg overflow-hidden'>
              <div className='h-8 bg-gray-300 dark:bg-gray-600 w-20' />
              <div className='h-8 bg-gray-300 dark:bg-gray-600 w-20 border-l dark:border-gray-600' />
            </div>
          </div>
        </div>

        {/* Comment input skeleton */}
        <div className='border-b dark:border-gray-500 p-3 sm:p-4'>
          <div className='flex gap-2 sm:gap-3'>
            <div className='flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full' />
            <div className='flex-1'>
              <div className='h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2' />
              <div className='flex justify-end gap-2'>
                <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded w-16' />
                <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded w-20' />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile pagination skeleton */}
        <div className='flex sm:hidden items-center justify-between px-2 py-1.5 border-b dark:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50'>
          <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-16' />
          <div className='flex items-center gap-1'>
            <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded border' />
            <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded border' />
          </div>
        </div>

        {/* Comments list skeleton */}
        <div className='p-2.5 sm:p-4'>
          <div className='space-y-3 sm:space-y-4'>
            {/* Generate 3-5 comment skeletons */}
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='flex gap-2 sm:gap-3'>
                  <div className='flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full' />
                  <div className='flex-1 border-b border-dashed dark:border-gray-500 pb-3 sm:pb-4'>
                    {/* User name and chapter tag */}
                    <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1'>
                      <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-24' />
                      <div className='h-5 bg-gray-400 dark:bg-gray-500 rounded-full w-16' />
                    </div>

                    {/* Comment content */}
                    <div className='space-y-1 mb-2'>
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full' />
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
                    </div>

                    {/* Timestamp and actions */}
                    <div className='flex items-center justify-between'>
                      <div className='h-3 bg-gray-400 dark:bg-gray-500 rounded w-16' />
                      <div className='flex items-center gap-2 sm:gap-3'>
                        <div className='flex items-center gap-1'>
                          <div className='w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded' />
                          <div className='h-3 bg-gray-400 dark:bg-gray-500 rounded w-4' />
                        </div>
                        <div className='flex items-center gap-1'>
                          <div className='w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded' />
                          <div className='h-3 bg-gray-400 dark:bg-gray-500 rounded w-4' />
                        </div>
                      </div>
                    </div>

                    {/* Reply button skeleton */}
                    <div className='flex items-center gap-2 mt-2'>
                      <div className='flex items-center gap-1'>
                        <div className='w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded' />
                        <div className='h-3 bg-gray-400 dark:bg-gray-500 rounded w-10' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentsListSkeleton
