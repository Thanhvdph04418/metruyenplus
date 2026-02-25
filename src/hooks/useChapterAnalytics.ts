import { useEffect } from 'react'
import { comicSingleChapter } from '@/types/data'
import { trackChapterRead } from '@/utils/analytics'

interface UseChapterAnalyticsParams {
  dataComics: any
  dataChapter: comicSingleChapter | undefined
  chapterInfo: any // Chapter info from dataComics.chapters
  idChapter: string
  slugComic: string
}

/**
 * Hook to track chapter read analytics events
 * Sends analytics event when chapter data is available
 */
export const useChapterAnalytics = ({
  dataComics,
  dataChapter,
  chapterInfo,
  idChapter,
  slugComic
}: UseChapterAnalyticsParams) => {
  useEffect(() => {
    if (dataComics && dataChapter && chapterInfo) {
      trackChapterRead({
        comic_id: dataComics.id.toString(),
        comic_title: dataComics.title,
        comic_slug: slugComic,
        chapter_id: idChapter,
        chapter_name: chapterInfo.name
      })
    }
  }, [dataComics, dataChapter, chapterInfo, idChapter, slugComic])
}
