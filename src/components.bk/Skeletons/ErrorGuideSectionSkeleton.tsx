const ErrorGuideSectionSkeleton = () => {
  return (
    <div className='bg-blue-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 animate-pulse'>
      <div className='container max-w-2xl mx-auto px-3 sm:px-4 lg:px-0'>
        <div className='flex flex-col items-center py-2'>
          {/* Error button skeleton */}
          <div className='flex items-center justify-center'>
            <div className='w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center gap-2'>
              <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16' />
            </div>
          </div>

          {/* Guide text skeleton */}
          <div className='flex items-center justify-center gap-2 mt-2 bg-blue-50/50 dark:bg-gray-800/50 py-3 sm:py-4 px-4 rounded-lg'>
            <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0' />
            <div className='flex items-center gap-1'>
              <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-12' />
              <div className='h-3 bg-gray-400 dark:bg-gray-500 rounded w-20' />
              <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-16' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorGuideSectionSkeleton
