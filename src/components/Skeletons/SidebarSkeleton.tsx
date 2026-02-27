const SidebarSkeleton = () => {
  return (
    <div className='space-y-6' style={{ minHeight: '600px' }}>
      {/* Top Comics Section Skeleton - Match TopComicsSection pill tabs */}
      <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden'>
        {/* Pill Tab Navigation Skeleton - Updated to match pill style */}
        <div className='p-3 pb-0'>
          <div className='inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 gap-1'>
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-md text-[13px] font-medium animate-pulse min-w-[80px] ${
                  index === 0 ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'bg-transparent'
                }`}
              >
                <div
                  className={`h-4 rounded ${
                    index === 0
                      ? 'bg-neutral-200 dark:bg-neutral-600 w-16'
                      : 'bg-neutral-200 dark:bg-neutral-700 w-16'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className='p-3 pt-4'>
          <div className='space-y-1'>
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors'
              >
                <div className='px-2'>
                  <div
                    className={`flex gap-3 py-2 animate-pulse ${
                      index !== 0 ? 'border-t border-neutral-200 dark:border-neutral-700' : ''
                    }`}
                  >
                    {/* Thumbnail Skeleton - Match Suggesnettruyens w-[60px] h-[80px] */}
                    <div className='flex-shrink-0 w-[60px] h-[80px] bg-neutral-200 dark:bg-neutral-700 rounded' />

                    {/* Content Skeleton */}
                    <div className='text-sm flex flex-col justify-between flex-1 space-y-1'>
                      {/* Title */}
                      <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4' />
                      {/* Chapter */}
                      <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2' />
                      {/* Genres */}
                      <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3' />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Comments Section Skeleton - Match RecentComments */}
      <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 max-w-full overflow-hidden'>
        {/* Header - Match text-[11px] font-semibold uppercase tracking-[0.2em] */}
        <div className='flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800'>
          <div className='h-3 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
        </div>

        {/* Comments Content */}
        <div className='p-3 overflow-hidden'>
          <div className='space-y-3 max-w-full'>
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className='animate-fadeIn max-w-full overflow-hidden'>
                <div className='flex gap-2 min-w-0 max-w-full animate-pulse'>
                  {/* Avatar Skeleton */}
                  <div className='flex-shrink-0 w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full' />

                  {/* Content Area */}
                  <div className='flex-1 min-w-0 max-w-full border-b border-dashed border-neutral-200 dark:border-neutral-700 pb-3 overflow-hidden'>
                    <div className='flex flex-col gap-1.5'>
                      {/* User Name */}
                      <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24' />

                      {/* Comic Section */}
                      <div className='flex items-center gap-2 min-w-0'>
                        {/* Comic Thumbnail */}
                        <div className='flex-shrink-0 w-8 h-10 bg-neutral-200 dark:bg-neutral-700 rounded' />

                        {/* Comic Links */}
                        <div className='flex flex-col min-w-0 flex-1 gap-1'>
                          <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3' />
                          <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2' />
                        </div>
                      </div>
                    </div>

                    {/* Comment Text */}
                    <div className='mt-1 space-y-1'>
                      <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full' />
                      <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4' />
                    </div>

                    {/* GIF Placeholder - Show randomly to simulate conditional rendering */}
                    {index % 4 === 0 && (
                      <div className='mt-1.5 max-w-[45px] flex-shrink-0'>
                        <div className='w-11 h-8 bg-neutral-200 dark:bg-neutral-700 rounded' />
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className='flex items-center justify-between mt-2'>
                      <div className='h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded' />
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
