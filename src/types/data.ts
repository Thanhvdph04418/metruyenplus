export interface dataComics {
  comics: comics[]
  current_page: number
  total_pages: number
  status: number
}

export type comics = {
  authors: string | string[]
  followers: string
  genres: [
    {
      id: string
      name: string
    }
  ]
  id: string
  slug: string
  is_trending: boolean
  last_chapter: {
    id: number
    name: string
    slug_chapter: string
  }
  other_names: string[]
  short_description: string
  status: string
  thumbnail: string
  title: string
  total_comments: string
  total_views: number
  updated_at: string
  like_count: number
}

export type dataGenres = [
  {
    id: string
    name: string
    description: string
  }
]

export type ResultAPIComicsDetail = {
  data: comicsDetail
  code: number
  message: string
}

export type comicsDetail = {
  title: string
  thumbnail: string
  description: string
  authors: string
  status: string
  genres: {
    id: string
    name: string
    slug_genre: string
  }[]
  total_views: number
  followers: number
  total_likes: number
  chapters: {
    id: number
    name: string
    slug_chapter: string
    created_at: number
    view_count: number
  }[]
  id: string
  other_names: Array<string>
  rate_average: number
  is_follow?: boolean
  is_like?: boolean
}

export type comicsChapter = {
  id: number
  name: string
  created_at: number
  view_count: number
  slug_chapter?: string
  slug?: string
}[]

interface Likes {
  count: number
  customerIds: number[]
}

export interface CommentContent {
  text: string
  gif?: string
  likes: Likes
}

export interface Comment {
  _id: string
  customerId: number
  customerInfo: {
    name: string
    avatar: string
    colorProfile: string
  }
  comicId: number
  comicInfo: {
    name: string
    thumbnail: string
  }
  chapterNumber?: number
  chapterInfo?: {
    chapterId: number
    name: string
  }
  content: CommentContent
  createdAt: number
  replies?: Comment[]
}

export interface CommentResponse {
  comments: Comment[]
  total_comments: number
  total_pages: number
  current_page: number
}

export type ResultAPIComicChapter = {
  data: comicSingleChapter
  code: number
  message: string
}

export type comicSingleChapter = {
  images: [
    {
      page: number
      src: string
    }
  ]
  chapters: [
    {
      id: number
      name: string
      slug_chapter: string
      chapter_number: number
    }
  ]
  chapter_name: string
  comic_name: string
  slug_comic: string
  comic_id: number
  chapter_id: number
}

export type comicSuggestSearch = [
  {
    id: string
    title: string
    thumbnail: string
    lastest_chapter: string
    genres: [string]
    authors: string
    slug: string
    slugChapter: string
  }
]

export type dataBanner = {
  id: number
  image: string
  isActive: boolean
  sequence: number
  comicId: number
  slugComic: string
}

export type verifyCaptchaChapterComic = {
  code: number
  message: string
  data: {
    token: string
  }
}

export type ResultLogin = {
  code: number
  message: string
  data?: {
    token: string
    customerInfo: User
  }
}

export type ResultCustomerInfo = {
  code: number
  message: string
  data: {
    customerInfo: User
  }
}

export interface User {
  id: string
  email: string
  username: string
  phone?: string
  name?: string
  avatar?: string
  colorProfile?: string
  isVip?: boolean
  vipExpiredAt?: string
}

export type ResultUpdateCustomerInfo = {
  code: number
  message: string
  data: User
}

export interface UploadResponse {
  code: number
  message: string
  data: string
}

type FollowComic = {
  comicId: number
  customerId: number
  comicInfo: {
    id: number
    name: string
    slug: string
    thumbnailUrl: string
  }
}

export type ResultListFollowComic = {
  code: number
  message: string
  data: FollowComic[]
  current_page: number
  total_pages: number
}

export type ResultRecentComments = {
  code: number
  message: string
  data: Comment[]
}

export type ResultRecommendComicsByComicId = {
  code: number
  message: string
  data: comics[]
}
