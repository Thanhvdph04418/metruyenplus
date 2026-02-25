interface Props {
  showIcon?: boolean
}

const HomeComicListSkeleton = ({ showIcon = true }: Props) => {
  return (
    <div className='relative'>
      {/* Title Section - Match HomeComicList exactly */}
      <div className='flex items-center justify-between mb-6 px-2'>
        <div className='flex items-center gap-2 lg:gap-4'>
          {showIcon && (
            <div className='w-7 h-7 lg:h-[32px] lg:w-[32px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          )}
          <div className='text-xl font-bold text-gray-800 dark:text-white min-h-[28px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32' />
        </div>
        <div className='flex items-center gap-1 text-sm text-black dark:text-white'>
          <div className='h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          <div className='w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        </div>
      </div>

      {/* Comics Grid Skeleton - Match CardItem structure */}
      <div className='min-h-[200px]'>
        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 xl:gap-4'>
          {Array.from({ length: 10 }, (_, index) => (
            <li key={index}>
              {/* Match CardItem container exactly */}
              <div className='relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm animate-pulse'>
                {/* Image Container - Match CardItem */}
                <div className='w-full h-[240px] xl:h-[220px] overflow-hidden relative bg-gray-200 dark:bg-gray-700 rounded-t-lg'>
                  {/* Trending Badge - Show randomly to simulate conditional rendering */}
                  {index % 3 === 0 && (
                    <div className='absolute top-1 right-1 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 text-transparent px-1.5 py-[1px] text-[10px] z-[1] rounded-full font-semibold shadow-lg'>
                      HOT
                    </div>
                  )}
                </div>

                {/* Content Section - Match CardItem exactly */}
                <div className='p-3 flex flex-col text-[#2d3748] dark:text-[#edf2f7] space-y-2'>
                  {/* Title - Match CardItem styling */}
                  <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-full' />
                  {/* Date - Match CardItem */}
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
                  {/* Chapter - Match CardItem */}
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* View More Button Skeleton - Match HomeComicList */}
      <div className='mt-8 text-center'>
        <div className='inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-transparent bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse'>
          Xem thêm
        </div>
      </div>
    </div>
  )
}

export default HomeComicListSkeleton
