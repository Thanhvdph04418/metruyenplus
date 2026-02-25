import { ChapterContentProps } from './types'
import ErrorGuideSection from './ErrorGuideSection'
import NotificationBanner from './NotificationBanner'
import { ErrorGuideSectionSkeleton, NotificationBannerSkeleton } from '@/components/Skeletons'
import ChapterImageGallery from './ChapterImageGallery'
import ReadingProgressBar from './ReadingProgressBar'
// import LoadingStatsFooter from './LoadingStatsFooter'
import { useImageLoadingStats } from '@/hooks/useImageLoadingStats'

const ChapterContent = ({ dataChapter, isFetching }: ChapterContentProps) => {
  const totalImages = dataChapter?.images?.length || 0
  const { onImageLoad, onImageError } = useImageLoadingStats(totalImages)

  return (
    <div className='flex flex-col min-h-screen h-full w-full reading-container'>
      {/* Reading Progress Bar */}
      {dataChapter && dataChapter.images.length > 0 && <ReadingProgressBar />}
      {dataChapter ? (
        <div className='w-full'>
          <ErrorGuideSection comicId={dataChapter.comic_id} chapterId={dataChapter.chapter_id} />
        </div>
      ) : (
        <div className='w-full'>
          <ErrorGuideSectionSkeleton />
        </div>
      )}
      <div className='w-full'>
        {dataChapter ? <NotificationBanner /> : <NotificationBannerSkeleton />}
      </div>

      {/* Images Section - Using new modular components */}
      {!dataChapter && (
        <div className='w-full max-w-full overflow-x-hidden px-0'>
          {/* Loading Skeleton */}
          {Array(15)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className='w-full aspect-[2/3] bg-zinc-700 animate-pulse mb-0 flex items-center justify-center'
              >
                <svg
                  className='w-12 h-12 text-zinc-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                </svg>
              </div>
            ))}
        </div>
      )}

      {/* Actual Images with Enhanced Lazy Loading */}
      {dataChapter && dataChapter.images.length > 0 && (
        <ChapterImageGallery
          images={dataChapter.images}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
        />
      )}

      {/* No Images Found Message */}
      {!isFetching && dataChapter && dataChapter.images.length <= 0 && (
        <div className='w-full aspect-[2/3] bg-zinc-700 flex items-center justify-center'>
          <h2 className='text-3xl text-white text-center px-4'>Không tìm thấy chương</h2>
        </div>
      )}

      {/* Loading Statistics Footer */}
      {/* {dataChapter && dataChapter.images.length > 0 && <LoadingStatsFooter stats={stats} />} */}
    </div>
  )
}

export default ChapterContent
