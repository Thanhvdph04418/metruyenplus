const ComicsDetailHeroSkeleton = () => {
  return (
    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 animate-pulse'>
      {/* Hero Image Skeleton - Match actual figure wrapper */}
      <figure className='w-[200px] h-[280px] sm:w-[240px] sm:h-[330px] dark:border dark:border-gray-600 -mt-20 flex-shrink-0 rounded-md overflow-hidden shadow-[0_0_5px_#444] bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
        <svg
          className='w-10 h-10 text-gray-400 dark:text-gray-500'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 18'
        >
          <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
        </svg>
      </figure>

      {/* Content Skeleton */}
      <div className='w-full text-center sm:text-left px-4 sm:px-0'>
        {/* Title and Rating Skeleton */}
        <div className='flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-2 sm:gap-6'>
          <div className='h-7 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 sm:w-96' />
          <div className='h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded' />
        </div>

        {/* Other Names Skeleton */}
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2 mx-auto sm:mx-0' />

        {/* Mobile Stats Skeleton */}
        <div className='sm:hidden flex flex-col gap-3 mt-3'>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className='flex items-center gap-3'>
              <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded' />
              <div className='w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded' />
              <div className='w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded' />
            </div>
          ))}
        </div>

        {/* Desktop Stats Skeleton */}
        <div className='hidden sm:block'>
          <div className='flex flex-col gap-2 mt-3'>
            <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-64' />
            <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-48' />
          </div>
          <div className='flex flex-wrap items-center gap-6 mt-3'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-20' />
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-24' />
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-20' />
          </div>
        </div>

        {/* Genres Skeleton */}
        <div className='flex flex-wrap gap-2 my-3'>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className='h-7 bg-gray-200 dark:bg-gray-700 rounded px-3'
              style={{ width: `${60 + index * 10}px` }}
            />
          ))}
        </div>

        {/* Description Skeleton */}
        <div className='space-y-2 mt-3'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
        </div>

        {/* Buttons Skeleton */}
        <div className='flex items-center justify-center sm:justify-start gap-3 mt-4'>
          <div className='w-full sm:w-48 h-[42px] bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0' />
          <div className='hidden sm:block w-32 h-[42px] bg-gray-200 dark:bg-gray-700 rounded' />
          <div className='hidden sm:block w-32 h-[42px] bg-gray-200 dark:bg-gray-700 rounded' />
        </div>

        {/* Mobile Buttons Skeleton */}
        <div className='flex sm:hidden items-center gap-2 mt-3'>
          <div className='flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded' />
          <div className='flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded' />
        </div>
      </div>
    </div>
  )
}

export default ComicsDetailHeroSkeleton
