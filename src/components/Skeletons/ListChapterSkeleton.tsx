// Skeleton component for chapter list
export const skeletonListChapter = () => {
    return (
        <div className='border rounded-lg p-2 sm:p-4 dark:border-gray-700 shadow-sm animate-pulse'>
            {/* Toolbar Skeleton */}
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 sm:items-center'>
                <div className='relative flex-1'>
                    <div className='w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg' />
                    <div className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
                </div>
                <div className='w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg' />
            </div>

            {/* Header Skeleton */}
            <div className='grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-md text-sm sm:text-base'>
                <div className='col-span-6'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-20' />
                </div>
                <div className='col-span-3'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16' />
                </div>
                <div className='col-span-3 text-right'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 ml-auto' />
                </div>
            </div>

            {/* Chapter List Skeleton */}
            <div className='h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
                <div className='space-y-0'>
                    {Array.from({ length: 15 }, (_, i) => (
                        <div
                            key={i}
                            className='grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 sm:py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-dashed dark:border-gray-700'
                        >
                            <div className='col-span-6 flex items-center'>
                                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-48' />
                            </div>
                            <div className='col-span-3 flex items-center'>
                                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-16' />
                            </div>
                            <div className='col-span-3 text-right flex items-center justify-end'>
                                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-12' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default skeletonListChapter