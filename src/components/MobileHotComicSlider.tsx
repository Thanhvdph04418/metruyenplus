import { comics } from '@/types/data'
import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import { formatNumber } from '@/utils/formatNumber'

// Utility function to format time ago
const formatTimeAgo = (dateString?: string) => {
  if (!dateString) {
    return 'Không xác định'
  }

  const now = new Date()
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Không xác định'
  }

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // Handle future dates
  if (diffInSeconds < 0) {
    return 'Vừa xong'
  }

  if (diffInSeconds < 60) {
    return 'Vừa xong'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} tháng trước`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} năm trước`
  }
}

interface Props {
  data?: comics[]
}

const MobileHotComicSlider = ({ data }: Props) => {
  if (!data || data.length === 0) return null

  // Get more comics for scrollable banners
  const scrollableBanners = useMemo(() => data.slice(0, 6), [data])

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  // Set loading to false when data is ready
  useEffect(() => {
    if (scrollableBanners.length > 0) {
      setIsLoading(false)
    }
  }, [scrollableBanners])


  return (
    <div className='relative w-full'>
      {/* Scrollable Banner Section */}
      <div className='mb-6'>
        {isLoading ? (
          <div className='flex gap-3 overflow-x-auto pb-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`loading-${index}`} className='flex-shrink-0 w-[280px] h-[380px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse'></div>
            ))}
          </div>
        ) : (
          <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
            {scrollableBanners.map((comic, index) => (
              <div key={`banner-${comic.id}-${index}`} className='relative group flex-shrink-0'>
                <Link to={`${PATH.comics}/${comic.slug}-${comic.id}`} className='block'>
                  <div className='relative w-[280px] h-[380px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg'>
                    <img
                      src={comic.thumbnail}
                      alt={comic.title}
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    
                    {/* Enhanced gradient overlay for better text readability */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent' />
                    
                    {/* Professional info overlay */}
                    <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
                      {/* Title with enhanced styling */}
                      <h3 className='font-bold text-xl mb-3 line-clamp-2 leading-tight text-white'>{comic.title}</h3>
                      
                      {/* Stats section with professional layout */}
                      <div className='space-y-2 mb-3'>
                        <div className='flex items-center gap-2 text-sm'>
                          <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                          <span className='font-medium text-gray-100'>{formatNumber(comic.total_views || 0)} lượt xem</span>
                        </div>
                        
                        <div className='flex items-center gap-2 text-sm'>
                          <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                          <span className='font-medium text-gray-100'>Manhwa Truyện Màu Action</span>
                        </div>
                        
                        <div className='flex items-center gap-2 text-sm'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span className='font-medium text-gray-100'>Chapter {comic.last_chapter?.name || '1'}</span>
                        </div>
                      </div>
                      
               
                    </div>

                    
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileHotComicSlider
