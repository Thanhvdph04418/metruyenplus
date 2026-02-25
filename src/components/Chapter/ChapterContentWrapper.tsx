import { comicSingleChapter } from '@/types/data'
import ChapterContent from './ChapterContent'

interface ChapterContentWrapperProps {
  dataChapter: comicSingleChapter | undefined
  isFetching: boolean
  onMouseDown: () => void
}

const ChapterContentWrapper = ({
  dataChapter,
  isFetching,
  onMouseDown
}: ChapterContentWrapperProps) => {
  return (
    <div className='bg-[#111] relative' onMouseDown={onMouseDown}>
      <div className='container max-w-2xl px-0'>
        <ChapterContent dataChapter={dataChapter as comicSingleChapter} isFetching={isFetching} />
      </div>
    </div>
  )
}

export default ChapterContentWrapper
