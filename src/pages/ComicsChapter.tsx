import comicApis from '@/apis/comicApis'
import {
  // AdNotice,
  Affiliate,
  ReadingProgress
} from '@/components'
import { useScrollTop, useChapterHistory, useChapterAnalytics, useChapterSEO } from '@/hooks'
import useScrollOnReload from '@/hooks/useScrollOnReload'
import useScrollDirection from '@/hooks/useScrollDirection'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useChapterNavigation } from '@/hooks/useChapterNavigation'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { comicSingleChapter } from '@/types/data'
import {
  ChapterTopNavigation,
  ChapterContentWrapper,
  ChapterBottomNavigation,
  ChapterCommentsSection
} from '@/components/Chapter'
import { BottomNavigationSkeleton } from '@/components/Skeletons'

// Main component
const ComicsChapter = () => {
  useScrollOnReload()
  const { comicIndentify, idChapter } = useParams()
  const [openList, setOpenList] = useState<boolean>(false)

  // Extract comic ID and slug
  const [comicId = '', slugComic = ''] =
    comicIndentify?.lastIndexOf('-') !== -1
      ? [
          comicIndentify?.slice(comicIndentify.lastIndexOf('-') + 1),
          comicIndentify?.slice(0, comicIndentify.lastIndexOf('-'))
        ]
      : []

  const { data, isFetching } = useQuery({
    queryKey: ['comic_chapter', idChapter],
    queryFn: async () => {
      const attemptFetch = async (): Promise<any> => {
        try {
          return await comicApis.genettruyenChapter(Number(idChapter), Number(comicId))
        } catch (error: any) {
          console.log('error', error)
          throw error
        }
      }

      return attemptFetch()
    },
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true,
    enabled: idChapter !== '', // Temporarily removed captcha conditions: && !isVerifying && isRecaptchaLoaded
    retry: false // Disable react-query's built-in retry mechanism
  })

  const { data: dataComic } = useQuery({
    queryKey: ['comic_detail', comicId],
    queryFn: () => comicApis.genettruyenDetail(String(comicId)),
    staleTime: 3 * 60 * 1000,
    enabled: comicId !== ''
  })
  const dataComics = dataComic?.data?.data
  const dataChapter = data?.data?.data
  const chapterInfo = dataComics?.chapters.find((ch) => ch.id === Number(idChapter))

  // Initialize all the new hooks
  const chapterNavigation = useChapterNavigation({
    dataChapter: dataChapter as comicSingleChapter,
    comicIdentify: comicIndentify as string,
    currentChapterId: idChapter as string,
    onNavigationStart: () => {
      // Could add loading state here if needed
    },
    onNavigationEnd: () => {
      // Could handle post-navigation logic here
    }
  })

  // Keyboard navigation
  useKeyboardNavigation({
    onPrevious: () => chapterNavigation.handleChangeEpisode('prev'),
    onNext: () => chapterNavigation.handleChangeEpisode('next'),
    onToggleChapterList: () => setOpenList(!openList),
    onEscape: () => setOpenList(false),
    onHome: () => chapterNavigation.navigateToHome(),
    disabled: !dataChapter, // Temporarily removed: isVerifying ||
    enableDebug: false
  })

  // History management hook
  useChapterHistory({
    dataComics,
    dataChapter,
    idChapter: idChapter as string,
    slugComic,
    comicId
  })

  // Analytics tracking hook
  useChapterAnalytics({
    dataComics,
    dataChapter,
    chapterInfo,
    idChapter: idChapter as string,
    slugComic
  })

  // Use the new navigation function from the hook
  const handleChangeEpisode = chapterNavigation.handleChangeEpisode

  useEffect(() => {
    document.getElementById(idChapter as string)?.scrollIntoView({ block: 'center' })
  }, [dataChapter])

  useScrollTop([idChapter])

  const scrollDirection = useScrollDirection()

  // SEO hook
  const seoElement = useChapterSEO({
    dataComics,
    dataChapter,
    chapterInfo,
    comicIndentify: comicIndentify as string,
    idChapter: idChapter as string
  })

  return (
    <>
      <Affiliate />

      <ReadingProgress />



      {seoElement}

      <ChapterTopNavigation
        scrollDirection={scrollDirection}
        dataChapter={dataChapter}
        comicIndentify={comicIndentify as string}
        idChapter={idChapter as string}
        comicId={comicId}
        openList={openList}
        setOpenList={setOpenList}
        handleChangeEpisode={handleChangeEpisode}
        navigationState={chapterNavigation.navigationState}
        onHomeClick={chapterNavigation.navigateToHome}
      />

      <ChapterContentWrapper
        dataChapter={dataChapter}
        isFetching={isFetching}
        onMouseDown={() => setOpenList(false)}
      />

      <div className='container max-w-2xl min-h-[60px]'>
        {dataChapter ? (
          <ChapterBottomNavigation
            idChapter={idChapter as string}
            dataChapter={dataChapter}
            handleChangeEpisode={handleChangeEpisode}
          />
        ) : (
          <BottomNavigationSkeleton />
        )}
        <ChapterCommentsSection
          comicId={comicId}
          dataChapter={dataChapter}
          idChapter={idChapter as string}
        />
      </div>
    </>
  )
}

export default ComicsChapter
