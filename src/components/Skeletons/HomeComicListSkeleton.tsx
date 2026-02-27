interface Props {
  showIcon?: boolean
}

const HomeComicListSkeleton = ({ showIcon = true }: Props) => {
  return (
    <div className='relative'>
      {/* Title Section - Match HomeComicList list layout exactly */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          {showIcon && (
            <div className='w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
          )}
          <div className='h-5 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-28' />
        </div>
        <div className='h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      </div>

      {/* Comics List Skeleton - Match ComicListRow structure */}
      <div className='min-h-[200px]'>
        <div className='divide-y divide-neutral-200 dark:divide-neutral-700'>
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className='flex items-center gap-3 py-2.5 animate-pulse'>
              {/* Thumbnail - Match ComicListRow: w-20 h-[6.5rem] */}
              <div className='w-20 h-[6.5rem] flex-shrink-0 rounded bg-neutral-200 dark:bg-neutral-700 overflow-hidden'>
                <img
                  src='/images/chapter-loading.svg'
                  alt='Loading comic...'
                  className='w-full h-full object-cover'
                  loading='eager'
                />
              </div>

              {/* Content - Match ComicListRow structure */}
              <div className='flex-1 min-w-0 space-y-2'>
                {/* Title */}
                <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4' />
                {/* Chapter */}
                <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2' />
              </div>

              {/* Date - Right aligned like ComicListRow */}
              <div className='h-3 w-14 bg-neutral-200 dark:bg-neutral-700 rounded flex-shrink-0' />
            </div>
          ))}
        </div>
      </div>

      {/* View More Button Skeleton - Match HomeComicList bordered button */}
      <div className='mt-4'>
        <div className='block text-center py-2 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse h-9' />
      </div>
    </div>
  )
}

export default HomeComicListSkeleton
