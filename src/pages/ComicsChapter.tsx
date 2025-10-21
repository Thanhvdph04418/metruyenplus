import comicApis from '@/apis/comicApis'
import {
  // AdNotice,
  Affiliate,
  EveningModeToggle,
  ListComment,
  ReadingProgress
} from '@/components'
import { useScrollTop } from '@/hooks'
import useScrollOnReload from '@/hooks/useScrollOnReload'
import useScrollDirection from '@/hooks/useScrollDirection'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useChapterNavigation } from '@/hooks/useChapterNavigation'
import PATH from '@/utils/path'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { comicSingleChapter } from '@/types/data'
import { historyAddComic, getComicHistory, updateReadChapters } from '@/utils/history'
import { Helmet } from 'react-helmet-async'
import { trackChapterRead } from '@/utils/analytics'
// import { jwtDecode } from 'jwt-decode'
import {
  ChapterNavigation,
  MobileNavigationControls,
  ChapterContent,
  Breadcrumb
} from '@/components/Chapter'
import {
  MobileNavigationControlsSkeleton,
  ChapterNavigationSkeleton,
  BreadcrumbSkeleton,
  BottomNavigationSkeleton,
  CommentsListSkeleton
} from '@/components/Skeletons'

declare global {
  interface Window {
    grecaptcha: any
  }
}

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
          return await comicApis.getComicChapter(Number(idChapter), Number(comicId))
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
    queryFn: () => comicApis.getComicDetail(String(comicId)),
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

  // Track chapter read events
  useEffect(() => {
    if (dataComics && dataChapter && chapterInfo) {
      trackChapterRead({
        comic_id: dataComics.id.toString(),
        comic_title: dataComics.title,
        comic_slug: slugComic,
        chapter_id: idChapter as string,
        chapter_name: chapterInfo.name
      })
    }
  }, [dataComics, dataChapter, chapterInfo, idChapter, slugComic])

  // Use the new navigation function from the hook
  const handleChangeEpisode = chapterNavigation.handleChangeEpisode

  useEffect(() => {
    document.getElementById(idChapter as string)?.scrollIntoView({ block: 'center' })
  }, [dataChapter])

  useScrollTop([idChapter])

  const scrollDirection = useScrollDirection()

  return (
    <>
      <Affiliate />
      <ReadingProgress />
      {/* Position the evening mode toggle at the middle of the right side */}
      <EveningModeToggle />
      <Helmet>
        <title>{`${dataComics?.title} ${dataComics?.chapters.at(0)?.name} - Tcomic`}</title>
        <meta
          name='description'
          content={`Đọc truyện ${dataComics?.title} ${chapterInfo?.name} miễn phí, không quảng cáo tại Tcomic. Cập nhật nhanh nhất, chất lượng cao, không quảng cáo, luôn luôn lắng nghe người dùng.`}
        />
        <meta
          name='keywords'
          content={`${dataComics?.title}, ${chapterInfo?.name}, truyện tranh, manga, manhua, manhwa, comic, webtoon , ${dataComics?.genres
            ?.map((g) => g.name)
            .join(', ')}`}
        />
        <meta name='author' content='Tcomic' />
        <meta name='robots' content='index, follow' />
        <link
          rel='canonical'
          href={`https://metruyenplus.com${PATH.comics}/${comicIndentify}/${chapterInfo?.slug_chapter}/${idChapter}`}
        />

        {/* Open Graph Tags - Enhanced */}
        <meta property='og:type' content='article' />
        <meta property='og:site_name' content='Tcomic' />
        <meta property='og:title' content={`${dataComics?.title} - ${chapterInfo?.name}`} />
        <meta
          property='og:description'
          content={`Đọc truyện ${dataComics?.title} ${chapterInfo?.name} và hàng ngàn chương truyện khác tại Tcomic - Cộng đồng đọc truyện tranh online lớn nhất Việt Nam`}
        />
        <meta property='og:image' content={dataChapter?.images[0]?.src} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:locale' content='vi_VN' />
        <meta
          property='og:url'
          content={`https://metruyenplus.com${PATH.comics}/${comicIndentify}/${chapterInfo?.slug_chapter}/${idChapter}`}
          title={`${dataComics?.title} - ${chapterInfo?.name}`}
        />

        {/* Twitter Card Tags - Enhanced */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@Tcomic' />
        <meta name='twitter:title' content={`${dataComics?.title} - ${chapterInfo?.name}`} />
        <meta
          name='twitter:description'
          content={`Đọc truyện ${dataComics?.title} ${chapterInfo?.name} và hàng ngàn chương truyện khác tại Tcomic - Cộng đồng đọc truyện tranh online lớn nhất Việt Nam`}
        />
        <meta name='twitter:image' content={dataChapter?.images[0]?.src} />
        <meta name='twitter:image:alt' content={`${dataComics?.title} chapter cover`} />

        {/* Enhanced Structured Data */}
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${dataComics?.title} - ${chapterInfo?.name}`,
            image: dataChapter?.images[0]?.src,
            datePublished: dataChapter?.created_at || new Date().toISOString(),
            dateModified: dataChapter?.updated_at || new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'Tcomic'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Tcomic',
              logo: {
                '@type': 'ImageObject',
                url: 'https://metruyenplus.com/icon-192x192.png'
              }
            },
            isPartOf: {
              '@type': 'Comic',
              name: dataComics?.title,
              url: `https://metruyenplus.com${PATH.comics}/${comicIndentify}`,
              description: dataComics?.description,
              author: dataComics?.authors,
              genre: dataComics?.genres?.map((genre: any) => genre.name).join(', ')
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://metruyenplus.com${PATH.comics}/${comicIndentify}/${chapterInfo?.slug_chapter}/${idChapter}`
            },
            description: `Đọc truyện ${dataComics?.title} ${chapterInfo?.name} miễn phí tại Tcomic`
          })}
        </script>

        {/* Enhanced Pagination Links */}
        {dataChapter?.chapters && (
          <>
            {dataChapter.chapters.find(
              (chapter: any) => Number(chapter.id) === Number(idChapter) - 1
            ) && (
              <link
                rel='prev'
                href={`https://metruyenplus.com${
                  PATH.comics
                }/${comicIndentify}/${dataChapter.chapters.find(
                  (chapter: any) => Number(chapter.id) === Number(idChapter) - 1
                )?.slug_chapter}/${Number(idChapter) - 1}`}
              />
            )}
            {dataChapter.chapters.find(
              (chapter: any) => Number(chapter.id) === Number(idChapter) + 1
            ) && (
              <link
                rel='next'
                href={`https://metruyenplus.com${
                  PATH.comics
                }/${comicIndentify}/${dataChapter.chapters.find(
                  (chapter: any) => Number(chapter.id) === Number(idChapter) + 1
                )?.slug_chapter}/${Number(idChapter) + 1}`}
              />
            )}
          </>
        )}
      </Helmet>

      {/* Ad Notice - Friendly notification about ads */}
      {/* <AdNotice /> */}

      <div
        className={classNames(
          'min-h-[60px] sticky left-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm w-full transition-all duration-300 translate-y-0',
          {
            'top-0': scrollDirection === 'up',
            '': scrollDirection === 'down'
          }
        )}
      >
        <div className='container max-w-2xl w-full pt-2'>
          {dataChapter ? (
            <div className='flex items-center justify-center px-3 sm:px-4 lg:px-0 w-full'>
              {/* Mobile view */}
              <MobileNavigationControls
                onHomeClick={chapterNavigation.navigateToHome}
                comicIndentify={comicIndentify as string}
                idChapter={idChapter as string}
                dataChapter={dataChapter}
                openList={openList}
                setOpenList={setOpenList}
                handleChangeEpisode={handleChangeEpisode}
                navigationState={chapterNavigation.navigationState}
              />

              {/* Desktop view */}
              <div className='hidden sm:flex items-center justify-between w-full'>
                <Breadcrumb
                  id={comicId}
                  idChapter={idChapter as string}
                  dataChapter={dataChapter}
                  comicIndentify={comicIndentify ?? ''}
                />
                <ChapterNavigation
                  idChapter={idChapter as string}
                  dataChapter={dataChapter}
                  openList={openList}
                  setOpenList={setOpenList}
                  handleChangeEpisode={handleChangeEpisode}
                  comicIndentify={comicIndentify as string}
                />
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-center px-3 sm:px-4 lg:px-0 w-full'>
              {/* Mobile Navigation Skeleton */}
              <MobileNavigationControlsSkeleton />

              {/* Desktop Navigation Skeleton */}
              <div className='hidden sm:flex items-center justify-between w-full'>
                <BreadcrumbSkeleton />
                <ChapterNavigationSkeleton />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='bg-[#111] relative' onMouseDown={() => setOpenList(false)}>
        <div className='container max-w-2xl px-0'>
          <ChapterContent dataChapter={dataChapter as comicSingleChapter} isFetching={isFetching} />
        </div>
      </div>
      <div className='container max-w-2xl min-h-[60px]'>
        {dataChapter ? (
          <div className='flex items-center justify-center gap-4 sm:gap-6 py-6 sm:py-8 px-4 lg:px-0'>
            <button
              title='Tập trước'
              onClick={() => handleChangeEpisode('prev')}
              className={classNames(
                'group flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 h-11 sm:h-14 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl shadow hover:shadow-md active:scale-[0.98] transition-all duration-200',
                {
                  'text-gray-900 dark:text-white':
                    Number(idChapter) !== dataChapter.chapters[dataChapter.chapters.length - 1].id,
                  'opacity-60 cursor-default hover:shadow active:scale-100':
                    Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id
                }
              )}
              disabled={
                Number(idChapter) === dataChapter.chapters[dataChapter.chapters.length - 1].id
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.5}
                stroke='currentColor'
                className='w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform duration-200'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 19.5L8.25 12l7.5-7.5'
                />
              </svg>
              <span className='font-medium sm:font-semibold text-sm sm:text-base'>Tập trước</span>
            </button>

            <button
              title='Tập sau'
              onClick={() => handleChangeEpisode('next')}
              className={classNames(
                'group flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 h-11 sm:h-14 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl shadow hover:shadow-md active:scale-[0.98] transition-all duration-200',
                {
                  'text-gray-900 dark:text-white': Number(idChapter) !== dataChapter.chapters[0].id,
                  'opacity-60 cursor-default hover:shadow active:scale-100':
                    Number(idChapter) === dataChapter.chapters[0].id
                }
              )}
              disabled={Number(idChapter) === dataChapter.chapters[0].id}
            >
              <span className='font-medium sm:font-semibold text-sm sm:text-base'>Tập sau</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.5}
                stroke='currentColor'
                className='w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform duration-200'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </button>
          </div>
        ) : (
          <BottomNavigationSkeleton />
        )}
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
      </div>
    </>
  )
}

export default ComicsChapter
