const SidebarSkeleton = () => {
  return (
    <div className='space-y-6' style={{ minHeight: '600px' }}>
      {/* Top Comics Section Skeleton - Match TopComicsSection */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
        {/* Tab Navigation Skeleton */}
        <div className='flex border-b border-gray-200 dark:border-gray-700'>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all animate-pulse
                ${
                  index === 0
                    ? 'bg-gray-300 dark:bg-gray-600 text-transparent'
                    : 'bg-gray-100 dark:bg-gray-700 text-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {index === 0 ? 'Top tháng' : index === 1 ? 'Top tuần' : 'Top ngày'}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className='p-3'>
          <div className='space-y-2'>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className='hover:bg-[#f6f6f6] dark:hover:bg-[rgba(255,255,255,0.1)]'>
                <div className='px-2'>
                  <div
                    className={`flex gap-2 py-2 animate-pulse ${
                      index !== 0 && 'border-t border-dashed border-[#D9D9D9] dark:border-gray-500'
                    }`}
                  >
                    {/* Thumbnail Skeleton - Match SuggestComics */}
                    <div className='flex-shrink-0 w-[60px] h-[80px] bg-gray-200 dark:bg-gray-700 rounded' />

                    {/* Content Skeleton */}
                    <div className='text-sm flex flex-col justify-between flex-1 space-y-1'>
                      {/* Title */}
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
                      {/* Chapter */}
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
                      {/* Genres */}
                      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Comments Section Skeleton - Match RecentComments */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 max-w-full overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700'>
          <div className='h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        </div>

        {/* Comments Content */}
        <div className='p-3 overflow-hidden'>
          <div className='space-y-3 max-w-full'>
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className='animate-fadeIn max-w-full overflow-hidden'>
                <div className='flex gap-2 min-w-0 max-w-full animate-pulse'>
                  {/* Avatar Skeleton */}
                  <div className='flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full' />

                  {/* Content Area */}
                  <div className='flex-1 min-w-0 max-w-full border-b border-dashed dark:border-gray-700 pb-3 overflow-hidden'>
                    <div className='flex flex-col gap-1.5'>
                      {/* User Name */}
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-24' />

                      {/* Comic Section */}
                      <div className='flex items-center gap-2 min-w-0'>
                        {/* Comic Thumbnail */}
                        <div className='flex-shrink-0 w-8 h-10 bg-gray-200 dark:bg-gray-700 rounded' />

                        {/* Comic Links */}
                        <div className='flex flex-col min-w-0 flex-1 gap-1'>
                          <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
                          <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
                        </div>
                      </div>
                    </div>

                    {/* Comment Text */}
                    <div className='mt-1 space-y-1'>
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
                    </div>

                    {/* GIF Placeholder - Show randomly to simulate conditional rendering */}
                    {index % 4 === 0 && (
                      <div className='mt-1.5 max-w-[45px] flex-shrink-0'>
                        <div className='w-11 h-8 bg-gray-200 dark:bg-gray-700 rounded' />
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className='flex items-center justify-between mt-2'>
                      <div className='h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded' />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarSkeleton
