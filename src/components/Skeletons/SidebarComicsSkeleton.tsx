interface Props {
  count?: number
}

const SidebarComicsSkeleton = ({ count = 10 }: Props) => {
  return (
    <div className='animate-pulse'>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`flex flex-row gap-3 items-stretch py-3 ${
            index !== 0 ? 'border-t border-dashed border-neutral-200 dark:border-neutral-700' : ''
          }`}
        >
          {/* Image Skeleton - Match RecommendComics: aspect-[3/4] w-20 sm:w-24 */}
          <div className='relative flex-shrink-0 w-20 sm:w-24 aspect-[3/4] rounded overflow-hidden bg-neutral-200 dark:bg-neutral-700'>
            <img
              src='/images/chapter-loading.svg'
              alt='Loading comic...'
              className='w-full h-full object-cover'
              loading='eager'
            />
          </div>

          {/* Content Skeleton - Match RecommendComics structure */}
          <div className='flex flex-col gap-1 min-w-0 flex-1 justify-center'>
            {/* Title Skeleton */}
            <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full' />

            {/* Chapter Skeleton */}
            <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2' />

            {/* Stats Skeleton - views and likes */}
            <div className='flex items-center gap-3 mt-1'>
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16' />
              <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SidebarComicsSkeleton
