const NotificationBannerSkeleton = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-3 sm:p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 animate-pulse'>
      {/* Mute button skeleton */}
      <div className='flex-shrink-0'>
        <div className='w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' />
      </div>

      {/* Notification text skeleton */}
      <div className='flex items-center gap-1'>
        <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-20' />
        <div className='h-3 bg-gray-400 dark:bg-gray-500 rounded w-32' />
        <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-16' />
      </div>
    </div>
  )
}

export default NotificationBannerSkeleton
