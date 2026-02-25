import { useState } from 'react'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface ChapterImageProps {
  src: string
  page: number
  index: number
  threshold: number
  scrollPosition?: ScrollPosition
  onImageLoad?: () => void
  onImageError?: () => void
}

const ChapterImage = ({
  src,
  page,
  index,
  threshold,
  scrollPosition,
  onImageLoad,
  onImageError
}: ChapterImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setLoaded(true)
    onImageLoad?.()
  }

  const handleError = () => {
    setError(true)
    onImageError?.()
  }

  // Error state with retry UI
  if (error) {
    return (
      <div className='w-full bg-zinc-700 flex items-center justify-center py-12'>
        <div className='flex flex-col items-center gap-3 text-zinc-400'>
          <svg
            className='w-10 h-10'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 18'
          >
            <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
          </svg>
          <span className='text-sm font-medium'>Lỗi tải ảnh trang {page}</span>
          <button
            onClick={() => setError(false)}
            className='px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200'
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  // Dynamic min-height to prevent layout shift
  return (
    <div
      className={`w-full transition-all duration-300 ${
        loaded ? 'min-h-0' : 'min-h-[400px] sm:min-h-[600px]'
      }`}
    >
      <LazyLoadImage
        src={src}
        alt={`Page ${page.toString()}`}
        title={`Page ${page.toString()}`}
        className='w-full h-auto block'
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block'
        }}
        placeholderSrc='/images/chapter-loading.svg'
        effect='opacity'
        threshold={threshold}
        useIntersectionObserver={index >= 5}
        scrollPosition={scrollPosition}
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
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

export default ChapterImage
