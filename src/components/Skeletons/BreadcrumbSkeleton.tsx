const BreadcrumbSkeleton = () => {
  return (
    <div className='hidden sm:flex items-center gap-1 my-3 animate-pulse'>
      {/* Home link skeleton - Hidden on small screens, shown on lg+ */}
      <div className='hidden lg:flex items-center'>
        <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-20' />
        <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded ml-1' />
      </div>

      {/* Comic link skeleton - Hidden on small screens, shown on md+ */}
      <div className='hidden md:flex items-center'>
        <div className='max-w-[200px] h-5 bg-gray-200 dark:bg-gray-700 rounded w-32' />
        <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded ml-1' />
      </div>

      {/* Chapter name skeleton */}
      <div className='max-w-[150px] h-5 bg-gray-300 dark:bg-gray-600 rounded w-24' />
    </div>
  )
}

export default BreadcrumbSkeleton
