import { ImageLoadingStats } from '@/hooks/useImageLoadingStats'

interface LoadingStatsFooterProps {
  stats: ImageLoadingStats
}

/**
 * Footer component displaying image loading statistics
 * Shows total loaded images and failed count if any
 */
const LoadingStatsFooter = ({ stats }: LoadingStatsFooterProps) => {
  const loadingPercentage = stats.total > 0 ? Math.round((stats.loaded / stats.total) * 100) : 0

  return (
    <div className='w-full py-6 text-center'>
      <div className='text-sm text-zinc-400 space-y-1'>
        <div>
          <span className='font-medium text-zinc-300'>
            {stats.loaded}/{stats.total}
          </span>{' '}
          ảnh đã tải
          {stats.loaded < stats.total && (
            <span className='ml-2 text-zinc-500'>({loadingPercentage}%)</span>
          )}
        </div>

        {stats.failed > 0 && (
          <div className='text-red-400 text-xs'>
            <svg className='w-3 h-3 inline-block mr-1' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
            {stats.failed} ảnh lỗi
          </div>
        )}

        {stats.loaded === stats.total && stats.failed === 0 && (
          <div className='text-green-400 text-xs'>
            <svg className='w-3 h-3 inline-block mr-1' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            Tất cả ảnh đã được tải
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadingStatsFooter
