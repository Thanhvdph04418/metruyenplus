import classNames from 'classnames'
import PATH from '@/utils/path'
import { MobileNavigationControlsProps } from './types'
import ChapterSelector from './ChapterSelector'

const MobileNavigationControls = ({
  onHomeClick,
  comicIndentify,
  idChapter,
  dataChapter,
  openList,
  setOpenList,
  handleChangeEpisode,
  navigationState
}: MobileNavigationControlsProps) => {
  // Add debounce to prevent oversensitive navigation
  const debouncedHandleChangeEpisode = (type: 'prev' | 'next') => {
    const now = Date.now()
    if (
      !debouncedHandleChangeEpisode.lastCall ||
      now - debouncedHandleChangeEpisode.lastCall > 500
    ) {
      handleChangeEpisode(type)
      debouncedHandleChangeEpisode.lastCall = now
    }
  }
  debouncedHandleChangeEpisode.lastCall = 0

  return (
    <div className='flex sm:hidden items-center justify-between w-full gap-2 px-2'>
      {/* Left controls */}
      <div className='flex items-center gap-2'>
        <button
          onClick={onHomeClick}
          className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95'
          aria-label='Về trang chủ'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.8}
            stroke='currentColor'
            className='w-5 h-5 text-gray-700 dark:text-gray-200'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
            />
          </svg>
        </button>

        <button
          onClick={() => (window.location.href = `${PATH.comics}/${comicIndentify}`)}
          className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95'
          aria-label='Xem thông tin truyện'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.8}
            stroke='currentColor'
            className='w-5 h-5 text-gray-700 dark:text-gray-200'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
            />
          </svg>
        </button>
      </div>

      {/* Chapter Navigation */}
      <div className='flex items-center gap-2'>
        <button
          title='Tập trước'
          onClick={() => debouncedHandleChangeEpisode('prev')}
          disabled={Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id}
          className={classNames(
            'flex items-center justify-center w-10 h-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-all active:scale-95',
            {
              'hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700':
                Number(idChapter) !== dataChapter.chapters[dataChapter.chapters.length - 1].id,
              'opacity-50 cursor-not-allowed':
                Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id
            }
          )}
          aria-label='Chương trước'
        >
          {navigationState?.isNavigating && navigationState?.direction === 'prev' ? (
            <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5 text-gray-700 dark:text-gray-200'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
            </svg>
          )}
        </button>

        <ChapterSelector
          idChapter={idChapter}
          dataChapter={dataChapter}
          openList={openList}
          setOpenList={setOpenList}
          comicIndentify={comicIndentify}
        />

        <button
          title='Tập sau'
          onClick={() => debouncedHandleChangeEpisode('next')}
          disabled={Number(idChapter) === dataChapter.chapters[0].id}
          className={classNames(
            'flex items-center justify-center w-10 h-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-all active:scale-95',
            {
              'hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700':
                Number(idChapter) !== dataChapter.chapters[0].id,
              'opacity-50 cursor-not-allowed': Number(idChapter) === dataChapter.chapters[0].id
            }
          )}
          aria-label='Chương sau'
        >
          {navigationState?.isNavigating && navigationState?.direction === 'next' ? (
            <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5 text-gray-700 dark:text-gray-200'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
            </svg>
          )}
        </button>
      </div>

      {/* Refresh button */}
      <button
        onClick={() => window.location.reload()}
        className='w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95'
        aria-label='Tải lại trang'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-5 h-5 text-gray-700 dark:text-gray-200'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
          />
        </svg>
      </button>
    </div>
  )
}

export default MobileNavigationControls
