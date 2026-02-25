interface ComicsListSkeletonProps {
  limit?: number
}

const ComicsListSkeleton = ({ limit = 21 }: ComicsListSkeletonProps) => {
  return (
    <>
      {Array(limit)
        .fill(0)
        .map((_, i) => (
          <li key={i} className='w-full min-h-[292px] overflow-hidden animate-pulse'>
            <div className='w-full h-[240px] xl:h-[220px] bg-zinc-700 flex-shrink-0 overflow-hidden'>
              <img
                src='/images/chapter-loading.svg'
                alt='Loading comic...'
                className='w-full h-full object-cover'
                loading='eager'
              />
            </div>
            <div className='mt-2 flex flex-col'>
              <span className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-4 mt-1' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-16 mb-2' />
              <span className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32' />
            </div>
          </li>
        ))}
    </>
  )
}

export default ComicsListSkeleton
