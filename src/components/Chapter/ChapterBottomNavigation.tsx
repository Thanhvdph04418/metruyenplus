import classNames from 'classnames'
import { comicSingleChapter } from '@/types/data'

interface ChapterBottomNavigationProps {
  idChapter: string
  dataChapter: comicSingleChapter
  handleChangeEpisode: (type: 'prev' | 'next') => void
}

const ChapterBottomNavigation = ({
  idChapter,
  dataChapter,
  handleChangeEpisode
}: ChapterBottomNavigationProps) => {
  return (
    <div className='flex items-center justify-center gap-4 sm:gap-6 py-6 sm:py-8 px-4 lg:px-0'>
      <button
        title='Tập trước'
        onClick={() => handleChangeEpisode('prev')}
        className={classNames(
          'group flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 h-11 sm:h-14 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl shadow hover:shadow-md active:scale-[0.98] transition-all duration-200',
          {
            'text-gray-900 dark:text-white':
              Number(idChapter) !== dataChapter.chapters[dataChapter.chapters.length - 1].id,
            'opacity-60 cursor-default hover:shadow active:scale-100':
              Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id
          }
        )}
        disabled={Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2.5}
          stroke='currentColor'
          className='w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform duration-200'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.75 19.5L8.25 12l7.5-7.5'
          />
        </svg>
        <span className='font-medium sm:font-semibold text-sm sm:text-base'>Tập trước</span>
      </button>

      <button
        title='Tập sau'
        onClick={() => handleChangeEpisode('next')}
        className={classNames(
          'group flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 h-11 sm:h-14 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl shadow hover:shadow-md active:scale-[0.98] transition-all duration-200',
          {
            'text-gray-900 dark:text-white': Number(idChapter) !== dataChapter.chapters[0].id,
            'opacity-60 cursor-default hover:shadow active:scale-100':
              Number(idChapter) === dataChapter.chapters[0].id
          }
        )}
        disabled={Number(idChapter) === dataChapter.chapters[0].id}
      >
        <span className='font-medium sm:font-semibold text-sm sm:text-base'>Tập sau</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2.5}
          stroke='currentColor'
          className='w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform duration-200'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
        </svg>
      </button>
    </div>
  )
}

export default ChapterBottomNavigation
