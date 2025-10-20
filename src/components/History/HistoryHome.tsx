import { useEffect, useState } from 'react'
import { HistoryComic, getRecentHistory } from '@/utils/history'
import HistoryMobile from './HistoryMobile'
import HistoryDesktop from './HistoryDesktop'
import HistoryHomeSkeleton from '@/components/Skeletons/HistoryHomeSkeleton'

const HistoryHome = () => {
  const [dataComics, setDataComics] = useState<HistoryComic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecentHistory = async () => {
      try {
        const recentHistory = await getRecentHistory(10)
        setDataComics(recentHistory)
      } catch (error) {
        console.error('Error loading recent history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentHistory()
  }, [])

  // Show skeleton while loading
  if (isLoading) {
    return <HistoryHomeSkeleton />
  }

  // Don't render anything if no history after loading
  if (dataComics.length === 0) {
    return null
  }

  return (
    <div className='bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-light-border dark:border-dark-highlight'>
      <HistoryMobile dataComics={dataComics} />
      <HistoryDesktop dataComics={dataComics} />
    </div>
  )
}

export default HistoryHome
