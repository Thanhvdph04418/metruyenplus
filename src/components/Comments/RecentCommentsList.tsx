import { Comment } from '@/types/data'
import RecentCommentItem from './RecentCommentItem'

interface RecentCommentsListProps {
  comments: Comment[]
  isLoading: boolean
}

const RecentCommentsList = ({ comments, isLoading }: RecentCommentsListProps) => {
  if (isLoading) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 max-w-full overflow-hidden'>
        <div className='flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Bình luận gần đây</h3>
        </div>
        <div className='p-3 overflow-hidden'>
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex gap-2 animate-pulse'>
                <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                  <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 max-w-full overflow-hidden'>
      <div className='flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Bình luận gần đây</h3>
      </div>

      <div className='p-3 overflow-hidden'>
        <ul className='space-y-3 max-w-full'>
          {comments.map((comment) => (
            <RecentCommentItem key={comment._id} comment={comment} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RecentCommentsList
