import { comicSingleChapter } from '@/types/data'
import { ListComment } from '@/components'
import { CommentsListSkeleton } from '@/components/Skeletons'

interface ChapterCommentsSectionProps {
  comicId: string | undefined
  dataChapter: comicSingleChapter | undefined
  idChapter: string
}

const ChapterCommentsSection = ({
  comicId,
  dataChapter,
  idChapter
}: ChapterCommentsSectionProps) => {
  return (
    <>
      {comicId ? (
        <ListComment
          id={comicId}
          chapterNumber={
            dataChapter
              ? dataChapter.chapters.find((item: any) => item.id === Number(idChapter))
                  ?.chapter_number
              : undefined
          }
        />
      ) : (
        <CommentsListSkeleton />
      )}
    </>
  )
}

export default ChapterCommentsSection
