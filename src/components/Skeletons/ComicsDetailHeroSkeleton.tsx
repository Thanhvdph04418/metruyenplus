const ComicsDetailHeroSkeleton = () => {
  return (
    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 animate-pulse'>
      {/* Hero Image Skeleton - Match actual figure wrapper */}
      <figure className='w-[160px] h-[224px] sm:w-[200px] sm:h-[280px] flex-shrink-0 rounded overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-700'>
        <img
          src='/images/chapter-loading.svg'
          alt='Loading comic...'
          className='w-full h-full object-cover'
          loading='eager'
        />
      </figure>

      {/* Content Skeleton */}
      <div className='w-full text-center sm:text-left'>
        {/* Title and Rating Skeleton */}
        <div className='flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-1.5 sm:gap-3'>
          <div className='h-7 sm:h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 sm:w-96' />
          <div className='h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded' />
        </div>

        {/* Other Names Skeleton */}
        <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mt-0.5 mx-auto sm:mx-0' />

        {/* Mobile Stats Skeleton */}
        <div className='sm:hidden flex flex-col gap-2 mt-2'>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className='flex items-center gap-3'>
              <div className='w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded' />
              <div className='w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded' />
              <div className='w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded' />
            </div>
          ))}
        </div>

        {/* Desktop Stats Skeleton */}
        <div className='hidden sm:block text-neutral-700 dark:text-neutral-200 mt-2'>
          <div className='flex flex-col gap-1 text-sm'>
            <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-64' />
            <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-48' />
          </div>
          <div className='flex flex-wrap items-center gap-x-6 gap-y-1 text-sm mt-1.5'>
            <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20' />
            <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24' />
            <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20' />
          </div>
        </div>

        {/* Genres Skeleton */}
        <div className='flex flex-wrap gap-2 mt-2 mb-2.5'>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className='h-7 bg-neutral-200 dark:bg-neutral-700 rounded px-3'
              style={{ width: `${60 + index * 10}px` }}
            />
          ))}
        </div>

        {/* Description Skeleton */}
        <div className='space-y-2'>
          <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full' />
          <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full' />
          <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4' />
        </div>

        {/* Buttons Skeleton */}
        <div className='flex items-center justify-center sm:justify-start gap-3 mt-3'>
          <div className='w-full sm:w-auto min-w-[180px] h-11 bg-neutral-200 dark:bg-neutral-700 rounded flex-shrink-0' />
          <div className='hidden sm:flex flex-1 h-10 bg-neutral-200 dark:bg-neutral-700 rounded' />
          <div className='hidden sm:flex flex-1 h-10 bg-neutral-200 dark:bg-neutral-700 rounded' />
        </div>

        {/* Mobile Buttons Skeleton */}
        <div className='flex sm:hidden items-center gap-2 mt-3'>
          <div className='flex-1 h-10 bg-neutral-200 dark:bg-neutral-700 rounded' />
          <div className='flex-1 h-10 bg-neutral-200 dark:bg-neutral-700 rounded' />
        </div>
      </div>
    </div>
  )
}

export default ComicsDetailHeroSkeleton
