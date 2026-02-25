import { trackWindowScroll, ScrollPosition } from 'react-lazy-load-image-component'
import { useWindowSize } from '@/hooks/useWindowSize'
import ChapterImage from './ChapterImage'

interface ImageData {
  page: number
  src: string
}

interface GalleryProps {
  images: ImageData[]
  scrollPosition: ScrollPosition
  onImageLoad?: () => void
  onImageError?: () => void
}

const Gallery = ({ images, scrollPosition, onImageLoad, onImageError }: GalleryProps) => {
  const { height } = useWindowSize()

  // Calculate dynamic threshold: 3x viewport height for optimal preloading
  // Mobile (667px): ~2000px | Desktop (1080px): ~3240px | 4K (2160px): ~6480px
  const dynamicThreshold = (height || 1000) * 3
  const dynamicThresholdForFirst5Images = (height || 1000) * 2

  return (
    <div className='w-full max-w-full overflow-x-hidden px-0'>
      {images.map((image, index) => (
        <ChapterImage
          key={image.page}
          src={image.src}
          page={image.page}
          index={index}
          threshold={index < 5 ? dynamicThresholdForFirst5Images : dynamicThreshold}
          scrollPosition={scrollPosition}
          onImageLoad={onImageLoad}
          onImageError={onImageError}
        />
      ))}
    </div>
  )
}

// Wrap with trackWindowScroll HOC for optimized scroll performance
const ChapterImageGallery = trackWindowScroll(Gallery)

export default ChapterImageGallery
