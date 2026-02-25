interface Props {
  count?: number
}

const SidebarComicsSkeleton = ({ count = 10 }: Props) => {
  return (
    <div className='animate-pulse'>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className='hover:bg-[#f6f6f6] dark:hover:bg-[rgba(255,255,255,0.1)]'>
          <div className='px-2'>
            <div
              className={`flex gap-2 py-2 ${
                index !== 0 && 'border-t border-dashed border-[#D9D9D9] dark:border-gray-500'
              }`}
            >
              {/* Image Skeleton */}
              <div className='flex-shrink-0 w-[60px] h-[80px] bg-zinc-700 rounded overflow-hidden'>
                <img
                  src='/images/chapter-loading.svg'
                  alt='Loading comic...'
                  className='w-full h-full object-cover'
                  loading='eager'
                />
              </div>

              {/* Content Skeleton */}
              <div className='text-sm flex flex-col justify-between flex-1'>
                {/* Title Skeleton */}
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1' />

                {/* Chapter Skeleton */}
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1' />

                {/* Genres Skeleton */}
                <div className='space-y-1'>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full' />
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SidebarComicsSkeleton
