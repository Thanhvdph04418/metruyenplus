import classNames from 'classnames'
import { comicSingleChapter } from '@/types/data'
import {
  MobileNavigationControls,
  Breadcrumb,
  ChapterNavigation
} from '@/components/Chapter'
import {
  MobileNavigationControlsSkeleton,
  BreadcrumbSkeleton,
  ChapterNavigationSkeleton
} from '@/components/Skeletons'
import { NavigationState } from './types'

interface ChapterTopNavigationProps {
  scrollDirection: 'up' | 'down'
  dataChapter: comicSingleChapter | undefined
  comicIndentify: string
  idChapter: string
  comicId: string
  openList: boolean
  setOpenList: (open: boolean) => void
  handleChangeEpisode: (type: 'prev' | 'next') => void
  navigationState: NavigationState | undefined
  onHomeClick: () => void
}

const ChapterTopNavigation = ({
  scrollDirection,
  dataChapter,
  comicIndentify,
  idChapter,
  comicId,
  openList,
  setOpenList,
  handleChangeEpisode,
  navigationState,
  onHomeClick
}: ChapterTopNavigationProps) => {
  return (
    <div
      className={classNames(
        'min-h-[60px] sticky left-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm w-full transition-all duration-300 translate-y-0',
        {
          'top-0': scrollDirection === 'up',
          '': scrollDirection === 'down'
        }
      )}
    >
      <div className='container max-w-2xl w-full pt-2'>
        {dataChapter ? (
          <div className='flex items-center justify-center px-3 sm:px-4 lg:px-0 w-full'>
            {/* Mobile view */}
            <MobileNavigationControls
              onHomeClick={onHomeClick}
              comicIndentify={comicIndentify}
              idChapter={idChapter}
              dataChapter={dataChapter}
              openList={openList}
              setOpenList={setOpenList}
              handleChangeEpisode={handleChangeEpisode}
              navigationState={navigationState}
            />

            {/* Desktop view */}
            <div className='hidden sm:flex items-center justify-between w-full'>
              <Breadcrumb
                id={comicId}
                idChapter={idChapter}
                dataChapter={dataChapter}
                comicIndentify={comicIndentify}
              />
              <ChapterNavigation
                idChapter={idChapter}
                dataChapter={dataChapter}
                openList={openList}
                setOpenList={setOpenList}
                handleChangeEpisode={handleChangeEpisode}
                comicIndentify={comicIndentify}
              />
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center px-3 sm:px-4 lg:px-0 w-full'>
            {/* Mobile Navigation Skeleton */}
            <MobileNavigationControlsSkeleton />

            {/* Desktop Navigation Skeleton */}
            <div className='hidden sm:flex items-center justify-between w-full'>
              <BreadcrumbSkeleton />
              <ChapterNavigationSkeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterTopNavigation
