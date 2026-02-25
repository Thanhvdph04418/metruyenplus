import { ChapterContentProps } from './types'
import ErrorGuideSection from './ErrorGuideSection'
import NotificationBanner from './NotificationBanner'
import { ErrorGuideSectionSkeleton, NotificationBannerSkeleton } from '@/components/Skeletons'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const ChapterContent = ({ dataChapter, isFetching }: ChapterContentProps) => (
  <div className='flex flex-col min-h-screen h-full w-full reading-container'>
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

    {/* Images Section with Fixed Aspect Ratios */}
    <div className='w-full max-w-full overflow-x-hidden px-0'>
      {/* Loading Skeleton - Match actual image layout */}
      {!dataChapter && (
        <>
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
        </>
      )}

      {/* Actual Images with Enhanced Lazy Loading */}
      {dataChapter && dataChapter.images.length > 0 && (
        <>
          {dataChapter.images.map((item, index) => (
            <LazyLoadImage
              key={item.page}
              src={item.src}
              alt={`Page ${item.page.toString()}`}
              title={`Page ${item.page.toString()}`}
              className='w-full h-auto block'
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block'
              }}
              placeholder={
                <div
                  className='w-full bg-zinc-700 flex items-center justify-center'
                  style={{ minHeight: '400px' }}
                >
                  <svg
                    className='w-8 h-8 text-zinc-500 animate-pulse'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 18'
                  >
                    <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                  </svg>
                </div>
              }
              // effect="opacity"
              threshold={index < 5 ? 0 : 100}
              useIntersectionObserver={index >= 5}
              referrerPolicy='no-referrer'
              wrapperClassName='w-full block'
              wrapperProps={{
                style: {
                  display: 'block',
                  width: '100%',
                  margin: 0,
                  padding: 0
                }
              }}
              onError={(e) => {
                // Fallback for broken images - replace with error placeholder
                const target = e.target as HTMLImageElement
                const wrapper = target.parentElement

                // Hide the broken image
                target.style.display = 'none'

                // Show error state in wrapper
                if (wrapper) {
                  wrapper.innerHTML = `
                    <div class="w-full bg-zinc-700 flex items-center justify-center" style="min-height: 400px;">
                      <div class="flex flex-col items-center gap-2 text-zinc-400">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                        </svg>
                        <span class="text-xs">Lỗi tải ảnh</span>
                      </div>
                    </div>
                  `
                }
              }}
            />
          ))}
        </>
      )}
    </div>

    {/* No Images Found Message */}
    {!isFetching && dataChapter && dataChapter.images.length <= 0 && (
      <div className='w-full aspect-[2/3] bg-zinc-700 flex items-center justify-center'>
        <h2 className='text-3xl text-white text-center px-4'>Không tìm thấy chương</h2>
      </div>
    )}
  </div>
)

export default ChapterContent
