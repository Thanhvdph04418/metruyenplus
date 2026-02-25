import { useHistoryData } from '@/hooks'
import HistoryMobile from './HistoryMobile'
import HistoryDesktop from './HistoryDesktop'
import HistoryHomeSkeleton from '@/components/Skeletons/HistoryHomeSkeleton'

const HistoryHome = () => {
  const { historyComics, isLoading, hasHistory } = useHistoryData(10)

  if (isLoading) {
    return <HistoryHomeSkeleton />
  }

  if (!hasHistory) {
    return null
  }

  return (
    <>
      <HistoryMobile dataComics={historyComics} />
      <HistoryDesktop dataComics={historyComics} />
    </>
  )
}

export default HistoryHome
