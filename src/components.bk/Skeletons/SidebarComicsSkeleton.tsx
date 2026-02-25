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
              <div className='flex-shrink-0 w-[60px] h-[80px] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-gray-400 dark:text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                </svg>
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
