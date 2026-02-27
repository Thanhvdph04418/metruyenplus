const HonettruyenSliderSkeleton = () => {
  return (
    <div
      className='relative w-full overflow-hidden'
      style={{
        containIntrinsicSize: '0 500px',
        isolation: 'isolate'
      }}
    >
      {/* Mobile Layout - Match MobileHonettruyenSlider: NO title, horizontal scroll with loading image */}
      <div className='block md:hidden mb-6'>
        <div className='flex gap-3 overflow-x-auto pb-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`mobile-loading-${index}`}
              className='flex-shrink-0 w-[280px] h-[380px] bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden animate-pulse'
            >
              <img
                src='/images/chapter-loading.svg'
                alt='Loading comic...'
                className='w-full h-full object-cover'
                loading='eager'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Match HonettruyenSlider: HAS title section + Embla carousel with loading image */}
      <div className='hidden md:block'>
        {/* Title Section - Only on desktop */}
        <div className='flex items-center justify-between mb-6 px-2'>
          <div className='flex items-center gap-2 lg:gap-4'>
            {/* Icon */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              width='32'
              height='32'
              className='w-7 h-7 lg:h-[32px] lg:w-[32px] text-primary'
            >
              <path d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' />
              <path d='M12 18a6 6 0 100-12 6 6 0 000 12z' />
            </svg>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white min-h-[28px]'>
              Truyện đề xuất
            </h2>
            <span className='bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 text-xs rounded-full font-semibold min-w-[80px] min-h-[20px] flex items-center justify-center'>
              TRENDING
            </span>
          </div>
        </div>

        {/* Embla Carousel Section with loading image */}
        <div className='relative mx-[-8px] px-4' style={{ minHeight: '400px' }}>
          <div className='embla'>
            <div className='embla__container'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div className='embla__slide loading' key={`desktop-loading-${index}`}>
                  <div className='w-full h-[400px] bg-neutral-200 dark:bg-neutral-700 rounded-xl overflow-hidden animate-pulse'>
                    <img
                      src='/images/chapter-loading.svg'
                      alt='Loading comic...'
                      className='w-full h-full object-cover'
                      loading='eager'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Navigation Buttons */}
          <div className='hidden md:block'>
            <button
              className='embla__button embla__button--prev absolute top-1/2 -translate-y-1/2 w-12 h-12
                         bg-white/95 dark:bg-neutral-800/95 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700
                         flex items-center justify-center z-20'
              aria-label='Previous slide'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.5}
                stroke='currentColor'
                className='w-6 h-6 text-neutral-700 dark:text-neutral-200'
                aria-hidden='true'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </button>
            <button
              style={{ right: '15px' }}
              className='embla__button embla__button--next absolute -right-0 top-1/2 -translate-y-1/2 w-12 h-12
                         bg-white/95 dark:bg-neutral-800/95 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700
                         flex items-center justify-center z-20'
              aria-label='Next slide'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.5}
                stroke='currentColor'
                className='w-6 h-6 text-neutral-700 dark:text-neutral-200'
                aria-hidden='true'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HonettruyenSliderSkeleton
