const HotComicSliderSkeleton = () => {
  const iconRecommend = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      width='32'
      height='32'
      className='w-7 h-7 lg:h-[32px] lg:w-[32px] text-gray-300 dark:text-gray-600'
    >
      <path d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' />
      <path d='M12 18a6 6 0 100-12 6 6 0 000 12z' />
    </svg>
  )

  return (
    <div
      className='relative content-visibility-auto'
      style={{
        containIntrinsicSize: '0 500px'
      }}
    >
      {/* Title Section */}
      <div className='flex items-center justify-between mb-6 px-2'>
        <div className='flex items-center gap-2 lg:gap-4'>
          {iconRecommend}
          <div className='text-xl font-bold text-gray-800 dark:text-white min-h-[28px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32' />
          <div className='bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-transparent px-2 py-0.5 text-xs rounded-full font-semibold animate-pulse min-w-[80px] min-h-[20px]'>
            TRENDING
          </div>
        </div>
      </div>

      {/* Embla Carousel Section */}
      <div className='relative mx-[-8px]' style={{ minHeight: '500px' }}>
        <div className='embla'>
          <div className='embla__container'>
            {Array.from({ length: 5 }, (_, index) => (
              <div className='embla__slide' key={index}>
                <div className='flex-shrink-0 w-full sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] px-2'>
                  <div className='bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-[360px] sm:h-[380px] md:h-[400px]'>
                    {/* Image Container with fixed aspect ratio */}
                    <div className='relative w-full h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse'>
                      {/* Stats Bar Skeleton */}
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2 sm:px-3 py-2.5'>
                        <div className='grid grid-cols-3 gap-1 sm:flex sm:items-center sm:justify-between'>
                          <div className='flex flex-col items-center sm:flex-row sm:gap-1.5'>
                            <div className='w-3 h-3 bg-gray-400 rounded mb-0.5 sm:mb-0' />
                            <div className='w-8 h-3 bg-gray-400 rounded' />
                          </div>
                          <div className='flex flex-col items-center sm:flex-row sm:gap-1.5'>
                            <div className='w-3 h-3 bg-gray-400 rounded mb-0.5 sm:mb-0' />
                            <div className='w-6 h-3 bg-gray-400 rounded' />
                          </div>
                          <div className='flex flex-col items-center sm:flex-row sm:gap-1.5'>
                            <div className='w-3 h-3 bg-gray-400 rounded mb-0.5 sm:mb-0' />
                            <div className='w-7 h-3 bg-gray-400 rounded' />
                          </div>
                        </div>
                      </div>

                      {/* Trending Badge Skeleton - Show randomly to simulate conditional rendering */}
                      {index % 3 === 0 && (
                        <div className='absolute top-3 right-3 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 text-transparent px-2.5 py-1 text-xs rounded-full font-semibold shadow-lg animate-pulse'>
                          HOT
                        </div>
                      )}
                    </div>

                    {/* Content Section with fixed heights */}
                    <div className='p-4 flex flex-col justify-between flex-1'>
                      {/* Title with fixed height */}
                      <div className='h-[24px] mb-2 overflow-hidden'>
                        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4' />
                      </div>

                      {/* Latest Chapter with fixed height */}
                      <div className='h-[20px] overflow-hidden'>
                        <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Navigation Buttons - Desktop only */}
        <div className='hidden md:block'>
          <div
            className='absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 
                       bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg 
                       flex items-center justify-center z-10 animate-pulse'
            aria-label='Previous slide skeleton'
          >
            <div className='w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded' />
          </div>
          <div
            className='absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 
                       bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg 
                       flex items-center justify-center z-10 animate-pulse'
            aria-label='Next slide skeleton'
          >
            <div className='w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotComicSliderSkeleton
