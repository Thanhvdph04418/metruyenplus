import { comicSingleChapter } from '@/types/data'

export interface NavigationState {
  isNavigating: boolean
  direction: 'prev' | 'next' | null
}

export interface ChapterNavigationProps {
  idChapter: string
  dataChapter: comicSingleChapter
  openList: boolean
  setOpenList: (value: boolean) => void
  handleChangeEpisode: (type: 'prev' | 'next') => void
  comicIndentify: string
}

export interface ChapterSelectorProps {
  idChapter: string
  dataChapter: comicSingleChapter
  openList: boolean
  setOpenList: (value: boolean) => void
  comicIndentify: string
}

export interface MobileNavigationControlsProps {
  onHomeClick: () => void
  comicIndentify: string
  idChapter: string
  dataChapter: comicSingleChapter
  openList: boolean
  setOpenList: (value: boolean) => void
  handleChangeEpisode: (type: 'prev' | 'next') => void
  navigationState?: NavigationState
}

export interface ChapterContentProps {
  dataChapter: comicSingleChapter
  isFetching: boolean
}

export interface ErrorGuideSectionProps {
  comicId: number
  chapterId: number
}

export interface BreadcrumbProps {
  id: string
  idChapter: string
  dataChapter: comicSingleChapter
  comicIndentify: string
}
