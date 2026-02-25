import { useEffect } from 'react'
import { comicSingleChapter } from '@/types/data'
import { historyAddComic, getComicHistory, updateReadChapters } from '@/utils/history'

interface UseChapterHistoryParams {
  dataComics: any // Comic detail data
  dataChapter: comicSingleChapter | undefined // Chapter data
  idChapter: string // Current chapter ID
  slugComic: string // Comic slug
  comicId: string // Comic ID
}

/**
 * Hook to manage chapter reading history
 * Updates IndexedDB with reading progress when chapter changes
 */
export const useChapterHistory = ({
  dataComics,
  dataChapter,
  idChapter,
  slugComic,
  comicId
}: UseChapterHistoryParams) => {
  useEffect(() => {
    const updateHistory = async () => {
      if (dataComics && dataChapter) {
        try {
          // Get existing history entry for this comic
          const existingData = await getComicHistory(dataComics.id)
          const currentChapterId = Number(idChapter)

          // Initialize or update read_chapter_ids
          let read_chapter_ids = existingData?.read_chapter_ids || []
          if (!read_chapter_ids.includes(currentChapterId)) {
            read_chapter_ids = [...read_chapter_ids, currentChapterId].sort((a, b) => a - b)
          }

          // Only update if the chapter has changed or entry doesn't exist
          if (!existingData || existingData.chapter_id !== currentChapterId) {
            await historyAddComic({
              id: dataComics.id,
              status: dataComics.status,
              title: dataComics.title,
              thumbnail: dataComics.thumbnail,
              reading_at: new Date().getTime(),
              time: `${new Date().getHours()}:${new Date().getMinutes()} - ${new Date().getDate()}/${
                new Date().getMonth() + 1
              }/${new Date().getFullYear()}`,
              last_reading: dataChapter.chapters.find((item: any) => item.id === currentChapterId)
                ?.name as string,
              chapter_id: currentChapterId,
              slug_comic: slugComic,
              slug_chapter: dataChapter.chapters.find((item: any) => item.id === currentChapterId)
                ?.slug_chapter as string,
              read_chapter_ids
            })
          } else {
            // Update read chapters if needed
            await updateReadChapters(dataComics.id, currentChapterId)
          }
        } catch (error) {
          console.error('Error updating reading history:', error)
        }
      }
    }

    updateHistory()
  }, [comicId, idChapter, dataComics, dataChapter, slugComic])
}
