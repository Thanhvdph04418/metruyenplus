const SearchSkeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4 sm:gap-6 h-full w-full animate-pulse overflow-hidden'>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className='flex col-span-1 sm:col-span-6'>
            <div className='flex items-center justify-center w-[120px] sm:w-[165px] h-[160px] sm:h-[220px] bg-gray-300 dark:bg-gray-700 flex-shrink-0'>
              <svg
                className='w-10 h-10 text-gray-200 dark:text-gray-600'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
              >
                <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
              </svg>
            </div>
            <div className='w-full pl-3 sm:pl-[15px] pr-2 flex flex-col flex-1 justify-around'>
              <div>
                <div className='h-2.5 sm:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32 sm:w-40 mb-3 sm:mb-4 -mt-2' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-14 sm:w-16 -mt-2' />
              </div>
              <div>
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-36 sm:w-44 mb-2.5' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full sm:w-[350px] mb-2.5' />
                <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-[250px] sm:w-[300px] mb-2.5' />
              </div>
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <div className='h-4 sm:h-5 bg-gray-200 rounded-md dark:bg-gray-700 w-12 sm:w-14' />
                <div className='h-4 sm:h-5 bg-gray-200 rounded-md dark:bg-gray-700 w-12 sm:w-14' />
                <div className='h-4 sm:h-5 bg-gray-200 rounded-md dark:bg-gray-700 w-12 sm:w-14' />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default SearchSkeleton
