import classNames from 'classnames'
import { ChapterNavigationProps } from './types'
import ChapterSelector from './ChapterSelector'

const ChapterNavigation = ({
  idChapter,
  dataChapter,
  openList,
  setOpenList,
  handleChangeEpisode,
  comicIndentify
}: ChapterNavigationProps) => (
  <div className='flex items-center gap-1.5 xs:gap-2 py-1.5 xs:py-2'>
    {/* Previous Chapter Button */}
    <button
      title='Tập trước'
      onClick={() => handleChangeEpisode('prev')}
      className={classNames(
        'flex items-center justify-center w-7 xs:w-9 h-7 xs:h-9 border dark:border-gray-600 rounded-full leading-3 active:scale-95 transition-all',
        {
          'hover:border-primary hover:text-primary dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800':
            Number(idChapter) !== dataChapter.chapters[dataChapter.chapters.length - 1].id,
          'opacity-60 cursor-default text-gray-700 dark:text-gray-400':
            Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id
        }
      )}
      disabled={Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.8}
        stroke='currentColor'
        className='w-4 xs:w-5 h-4 xs:h-5'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
      </svg>
    </button>

    {/* Chapter Selector */}
    <ChapterSelector
      idChapter={idChapter}
      dataChapter={dataChapter}
      openList={openList}
      setOpenList={setOpenList}
      comicIndentify={comicIndentify}
    />

    {/* Next Chapter Button */}
    <button
      title='Tập sau'
      onClick={() => handleChangeEpisode('next')}
      className={classNames(
        'flex items-center justify-center w-7 xs:w-9 h-7 xs:h-9 border dark:border-gray-600 rounded-full leading-3 active:scale-95 transition-all',
        {
          'hover:border-primary hover:text-primary dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800':
            Number(idChapter) !== dataChapter.chapters[0].id,
          'opacity-60 cursor-default text-gray-700 dark:text-gray-400':
            Number(idChapter) === dataChapter.chapters[0].id
        }
      )}
      disabled={Number(idChapter) === dataChapter.chapters[0].id}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.8}
        stroke='currentColor'
        className='w-4 xs:w-5 h-4 xs:h-5'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
      </svg>
    </button>
  </div>
)

export default ChapterNavigation
