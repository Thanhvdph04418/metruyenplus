import { useCallback, useState } from 'react'
import PATH from '@/utils/path'
import { comicSingleChapter } from '@/types/data'
import { checkAndTriggerAffiliate } from '@/utils/affiliate'

interface ChapterNavigationConfig {
  dataChapter: comicSingleChapter
  comicIdentify: string
  currentChapterId: string
  onNavigationStart?: () => void
  onNavigationEnd?: () => void
}

interface NavigationState {
  isNavigating: boolean
  direction: 'prev' | 'next' | null
}

export const useChapterNavigation = (config: ChapterNavigationConfig) => {
  const { dataChapter, comicIdentify, currentChapterId, onNavigationStart } = config
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    direction: null
  })

  const navigateToChapter = useCallback(
    (chapterId: number, slugChapter: string, direction?: 'prev' | 'next') => {
      if (navigationState.isNavigating) return

      setNavigationState({ isNavigating: true, direction: direction || null })
      onNavigationStart?.()

      // Check and trigger affiliate link if rate limit allows
      // This happens synchronously with user action to avoid popup blockers
      checkAndTriggerAffiliate()

      // Use original full page reload navigation
      const newPath = `${PATH.comics}/${comicIdentify}/${slugChapter}/${chapterId}`
      window.location.href = newPath
    },
    [comicIdentify, navigationState.isNavigating, onNavigationStart]
  )

  const handleChangeEpisode = useCallback(
    (type: 'prev' | 'next') => {
      if (!dataChapter || navigationState.isNavigating) return

      const episodes = [...dataChapter.chapters].reverse()
      const currentIndex = episodes.findIndex((chapter) => chapter.id === Number(currentChapterId))

      if (currentIndex === -1) return

      const nextIndex = currentIndex + (type === 'next' ? 1 : -1)
      const targetChapter = episodes[nextIndex]

      if (targetChapter && dataChapter.chapters.some((ch) => ch.id === targetChapter.id)) {
        navigateToChapter(targetChapter.id, targetChapter.slug_chapter, type)
      }
    },
    [dataChapter, currentChapterId, navigateToChapter, navigationState.isNavigating]
  )

  const navigateToHome = useCallback(() => {
    if (navigationState.isNavigating) return
    window.location.href = PATH.home
  }, [navigationState.isNavigating])

  const navigateToComicDetail = useCallback(() => {
    if (navigationState.isNavigating) return
    window.location.href = `${PATH.comics}/${comicIdentify}`
  }, [comicIdentify, navigationState.isNavigating])

  const navigateToSpecificChapter = useCallback(
    (chapterId: number) => {
      if (navigationState.isNavigating) return

      const chapter = dataChapter.chapters.find((ch) => ch.id === chapterId)
      if (chapter) {
        navigateToChapter(chapter.id, chapter.slug_chapter)
      }
    },
    [dataChapter, navigateToChapter, navigationState.isNavigating]
  )

  // Get navigation capabilities
  const canNavigatePrev = useCallback(() => {
    if (!dataChapter) return false
    return Number(currentChapterId) !== dataChapter.chapters[dataChapter.chapters.length - 1]?.id
  }, [dataChapter, currentChapterId])

  const canNavigateNext = useCallback(() => {
    if (!dataChapter) return false
    return Number(currentChapterId) !== dataChapter.chapters[0]?.id
  }, [dataChapter, currentChapterId])

  // Get chapter information
  const getCurrentChapterInfo = useCallback(() => {
    if (!dataChapter) return null
    return dataChapter.chapters.find((ch) => ch.id === Number(currentChapterId))
  }, [dataChapter, currentChapterId])

  const getPrevChapterInfo = useCallback(() => {
    if (!dataChapter) return null
    const episodes = [...dataChapter.chapters].reverse()
    const currentIndex = episodes.findIndex((ch) => ch.id === Number(currentChapterId))
    return currentIndex > 0 ? episodes[currentIndex - 1] : null
  }, [dataChapter, currentChapterId])

  const getNextChapterInfo = useCallback(() => {
    if (!dataChapter) return null
    const episodes = [...dataChapter.chapters].reverse()
    const currentIndex = episodes.findIndex((ch) => ch.id === Number(currentChapterId))
    return currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null
  }, [dataChapter, currentChapterId])

  return {
    // Navigation functions
    handleChangeEpisode,
    navigateToHome,
    navigateToComicDetail,
    navigateToSpecificChapter,
    navigateToChapter,

    // Navigation state
    navigationState,
    canNavigatePrev: canNavigatePrev(),
    canNavigateNext: canNavigateNext(),

    // Chapter information
    currentChapter: getCurrentChapterInfo(),
    prevChapter: getPrevChapterInfo(),
    nextChapter: getNextChapterInfo()
  }
}
