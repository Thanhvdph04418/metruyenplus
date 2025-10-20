import comicApis from '@/apis/comicApis'
import {
  AffiliateNotice,
  EveningModeToggle,
  ListChapter,
  ListComment,
  ListDownloadChapter,
  RatingStar,
  SuggestComics
} from '@/components'
import { ComicsDetailHeroSkeleton, SidebarComicsSkeleton } from '@/components/Skeletons'
import { formatCurrency } from '@/utils/formatNumber'
import PATH, { PATH_MAPPING_API } from '@/utils/path'
import { useQuery } from 'react-query'
import { Link, createSearchParams, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import imgError from '/img-error.webp'
import { NotFound } from '@/App'
import { Helmet } from 'react-helmet-async'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaUserPlus, FaUserCheck } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import RecommendComics from '@/components/RecommendComics'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  mergeImageConfig,
  imageCache,
  createImageErrorHandler,
  generatePlaceholder,
  LAZY_LOAD_CONFIGS
} from '@/utils/imageOptimization'
import { getComicHistory } from '@/utils/history'
import { trackComicView } from '@/utils/analytics'

const ComicsDetail = () => {
  const { comicIndentify } = useParams()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const description = useRef<HTMLParagraphElement>(null)
  const lastHyphenIndex = comicIndentify?.lastIndexOf('-') ?? -1
  const [id = '', slug = ''] =
    lastHyphenIndex !== -1
      ? [comicIndentify?.slice(lastHyphenIndex + 1), comicIndentify?.slice(0, lastHyphenIndex)]
      : []
  const [lastReadChapter, setLastReadChapter] = useState<{
    id: number
    name: string
    slug_chapter: string
  } | null>(null)

  // PRIORITY 1: Comic Detail - Critical data first
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['comic_detail', id],
    queryFn: () => comicApis.getComicDetail(id as string),
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    cacheTime: 10 * 60 * 1000, // 10 minutes in cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    enabled: id !== '',
    retry: 2, // Reduce retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  // Load weekly data in parallel (no dependencies for better performance)
  const { data: dataWeekly, isLoading: isLoadingWeekly } = useQuery({
    queryKey: [`${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`, { page: '1', status: 'all' }],
    queryFn: () =>
      comicApis.getComicsByUrl(`${PATH_MAPPING_API.top}${PATH_MAPPING_API.weekly}`, {
        page: '1',
        status: 'all'
      }),
    staleTime: 10 * 60 * 1000, // Longer cache for sidebar
    cacheTime: 15 * 60 * 1000, // Keep in memory longer
    keepPreviousData: true, // Smooth transitions
    refetchOnWindowFocus: false, // Sidebar doesn't need frequent updates
    retry: 1 // Reduce retries for non-critical data
  })

  // Load popular data in parallel (no dependencies for better performance)
  const { data: dataPopular, isLoading: isLoadingPopular } = useQuery({
    queryKey: [`${PATH_MAPPING_API.popular}`, { page: '1' }],
    queryFn: () => comicApis.getComicsByUrl(`${PATH_MAPPING_API.popular}`, { page: '1' }),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    keepPreviousData: true, // No loading flashes
    refetchOnWindowFocus: false,
    retry: 1
  })
  // Memoize expensive computations for better performance
  const dataPopularComics = useMemo(
    () => dataPopular?.data.comics?.filter((comic) => comic.last_chapter),
    [dataPopular?.data.comics]
  )
  const dataWeeklyComics = useMemo(
    () => dataWeekly?.data.comics?.filter((comic) => comic.last_chapter),
    [dataWeekly?.data.comics]
  )
  const dataComics = useMemo(() => data?.data?.data, [data?.data?.data])

  // Smart loading state for main content
  const isMainContentLoading = isLoading && !data
  if (dataComics?.other_names) {
    dataComics.other_names = dataComics.other_names.filter((name) => name)
  }
  useEffect(() => {
    if (description.current) {
      setIsShow(description.current.scrollHeight !== description.current.clientHeight)
    }
  }, [dataComics])

  useEffect(() => {
    setLastReadChapter(null)
  }, [id])

  useEffect(() => {
    const loadLastReadChapter = async () => {
      if (dataComics?.id) {
        try {
          const history = await getComicHistory(dataComics.id)
          if (history) {
            const chapter = dataComics.chapters.find((c) => c.id === history.chapter_id)
            if (chapter) {
              setLastReadChapter({
                id: chapter.id,
                name: chapter.name,
                slug_chapter: chapter.slug_chapter
              })
            }
          }
        } catch (error) {
          console.error('Error loading last read chapter:', error)
        }
      }
    }

    loadLastReadChapter()
  }, [dataComics])

  // Track comic view events
  useEffect(() => {
    if (dataComics && !isLoading) {
      trackComicView({
        comic_id: dataComics.id.toString(),
        comic_title: dataComics.title,
        comic_slug: slug
      })
    }
  }, [dataComics, isLoading, slug])

  // Hero image optimization - check if already cached
  const isHeroCached = dataComics ? imageCache.isInCache(dataComics.thumbnail) : false
  const heroImageConfig = mergeImageConfig({
    ...LAZY_LOAD_CONFIGS.hero,
    visibleByDefault: isHeroCached || true, // Hero images should load immediately
    threshold: 300 // Load earlier for hero images
  })

  // Enhanced error handling for hero image
  const handleHeroImageError = createImageErrorHandler(imgError, () => {
    console.log('Retrying hero image load')
  })

  // Track hero image loading
  const handleHeroImageLoad = () => {
    if (dataComics) {
      imageCache.addToCache(dataComics.thumbnail)
    }
  }

  const heroPlaceholderSrc = generatePlaceholder(240, 330)

  const tokenCustomer = localStorage.getItem('auth_token')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleFollow = async () => {
    if (!tokenCustomer) {
      toast.error('Vui lòng đăng nhập để theo dõi truyện')
      return
    }

    try {
      setIsFollowing(true)
      const token = localStorage.getItem('auth_token')
      if (!token || !dataComics?.id) return

      if (dataComics.is_follow) {
        await comicApis.removeFollowComic(token, Number(dataComics.id))
        toast.success('Đã hủy theo dõi truyện')
      } else {
        await comicApis.addFollowComic(token, Number(dataComics.id))
        toast.success('Đã theo dõi truyện')
      }

      // Refetch comic detail to update follow status
      await refetch()
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau')
    } finally {
      setIsFollowing(false)
    }
  }

  const handleLike = async () => {
    if (!tokenCustomer) {
      toast.error('Vui lòng đăng nhập để yêu thích truyện')
      return
    }

    try {
      setIsLiking(true)
      const token = localStorage.getItem('auth_token')
      if (!token || !dataComics?.id) return

      if (dataComics.is_like) {
        await comicApis.removeLikeComic(token, Number(dataComics.id))
        toast.success('Đã bỏ thích truyện')
      } else {
        await comicApis.addLikeComic(token, Number(dataComics.id))
        toast.success('Đã thích truyện')
      }

      // Refetch comic detail to update like status
      await refetch()
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <>
      <EveningModeToggle />
      <Helmet>
        {/* Add new canonical */}
        <link rel='canonical' href={`https://metruyenplus.com${PATH.comics}/${slug}-${id}`} />

        {/* Primary Meta Tags */}
        <title>{`${dataComics?.title} [${dataComics?.chapters.at(0)?.name}] | MeTruyen+`}</title>
        <meta name='title' content={`${dataComics?.title} | Đọc Truyện Tranh Online - MeTruyen+`} />
        <meta
          name='description'
          content={`✅ Đọc truyện chữ ${dataComics?.title} ${
            dataComics?.other_names && dataComics?.other_names.length > 0
              ? `(${dataComics.other_names.join(', ')})`
              : ''
          } Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại MeTruyen+. Thể loại: ${dataComics?.genres
            ?.map((g) => g.name)
            .join(', ')}`}
        />
        <meta
          name='keywords'
          content={`đọc truyện chữ, ${dataComics?.title}, ${
            dataComics?.other_names?.join(', ') || ''
          }, truyện chữ online, manga, ${dataComics?.genres?.map((g) => g.name).join(', ')}`}
        />

        {/* Open Graph / Facebook */}
        <meta property='og:type' content='article' />
        <meta property='og:site_name' content='MeTruyen+' />
        <meta
          property='og:title'
          content={`${dataComics?.title} | Đọc Truyện Tranh Online - MeTruyen+`}
        />
        <meta
          property='og:description'
          content={`Đọc truyện chữ ${dataComics?.title} Tiếng Việt bản dịch Full mới nhất. ${dataComics?.description?.substring(
            0,
            150
          )}...`}
        />
        <meta property='og:image' content={dataComics?.thumbnail} />
        <meta property='og:image:alt' content={`Ảnh bìa truyện ${dataComics?.title}`} />
        <meta property='og:url' content={`https://metruyenplus.com${PATH.comics}/${slug}-${id}`} />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@MeTruyen+' />
        <meta
          name='twitter:title'
          content={`${dataComics?.title} | Đọc Truyện Tranh Online - MeTruyen+`}
        />
        <meta
          name='twitter:description'
          content={`Đọc truyện chữ ${dataComics?.title} Tiếng Việt bản dịch Full mới nhất. ${dataComics?.description?.substring(
            0,
            150
          )}...`}
        />
        <meta name='twitter:image' content={dataComics?.thumbnail} />
        <meta name='twitter:image:alt' content={`Ảnh bìa truyện ${dataComics?.title}`} />

        {/* Additional Meta Tags */}
        <meta name='author' content={dataComics?.authors || 'MeTruyen+'} />
        <meta name='robots' content='index, follow' />

        {/* Comic-specific structured data with more details */}
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://metruyenplus.com${PATH.comics}/${slug}-${id}`
            },
            headline: dataComics?.title,
            alternativeHeadline: dataComics?.other_names?.join(', '),
            image: {
              '@type': 'ImageObject',
              url: dataComics?.thumbnail,
              width: '800',
              height: '600'
            },
            author: {
              '@type': 'Person',
              name: dataComics?.authors
            },
            genre: dataComics?.genres?.map((g) => g.name).join(', '),
            keywords: `truyện chữ, ${dataComics?.title}, manga`,
            publisher: {
              '@type': 'Organization',
              name: 'MeTruyen+',
              logo: {
                '@type': 'ImageObject',
                url: 'https://metruyenplus.com/icon-192x192.png'
              }
            },
            description: dataComics?.description,
            articleSection: 'Truyện tranh',
            articleBody: dataComics?.description,
            interactionStatistic: [
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/LikeAction',
                userInteractionCount: dataComics?.total_likes
              },
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/ViewAction',
                userInteractionCount: dataComics?.total_views
              }
            ]
          })}
        </script>
      </Helmet>
      <Toaster />
      {!(isError || Number(dataComics?.status) === 404) && (
        <>
          <div className='w-full min-h-[400px] relative overflow-hidden'>
            <p
              className='bg-no-repeat bg-cover h-[400px]'
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                backgroundImage: `url('${dataComics?.thumbnail}')`,
                filter: 'blur(60px)'
              }}
            />
          </div>
          <div className='container mt-[-300px] blur-0'>
            <div className='w-full'>
              <div className='h-full container rounded-t-lg bg-white dark:bg-gray-900 px-2 sm:px-4 lg:px-10'>
                <div className='pt-[35px] pb-[30px] min-h-[300px]' style={{ contain: 'layout' }}>
                  {dataComics && !isMainContentLoading && (
                    <div className='flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5'>
                      <figure className='w-[200px] h-[280px] sm:w-[240px] sm:h-[330px] dark:border dark:border-gray-600 -mt-20 flex-shrink-0 rounded-md overflow-hidden shadow-[0_0_5px_#444]'>
                        <LazyLoadImage
                          src={dataComics.thumbnail}
                          alt={dataComics.title}
                          title={dataComics.title}
                          width={240}
                          height={330}
                          effect={heroImageConfig.effect}
                          placeholderSrc={heroPlaceholderSrc}
                          threshold={heroImageConfig.threshold}
                          delayTime={heroImageConfig.delayTime}
                          delayMethod={heroImageConfig.delayMethod}
                          useIntersectionObserver={heroImageConfig.useIntersectionObserver}
                          visibleByDefault={heroImageConfig.visibleByDefault}
                          loading='eager' // Always load hero images eagerly
                          decoding='sync' // Synchronous decoding for better LCP
                          wrapperClassName='block w-full h-full'
                          className='h-full w-full object-cover pointer-events-none select-none priority-image'
                          onLoad={handleHeroImageLoad}
                          onError={handleHeroImageError}
                          beforeLoad={() => {
                            // Pre-load hero image for better performance
                            if (!isHeroCached) {
                              const img = new Image()
                              img.src = dataComics.thumbnail
                            }
                          }}
                        />
                      </figure>
                      <div className='w-full text-center sm:text-left px-4 sm:px-0'>
                        <div className='flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-2 sm:gap-6'>
                          <h1
                            title={dataComics.title}
                            className='font-semibold text-lg sm:text-2xl text-black dark:text-white line-clamp-3 sm:line-clamp-2'
                          >
                            {dataComics.title
                              .split(' ')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </h1>
                          <RatingStar rating={dataComics.rate_average} />
                        </div>
                        {dataComics.other_names && dataComics.other_names.length > 0 && (
                          <p className='text-sm text-black/50 dark:text-gray-400 mt-1 italic'>
                            {dataComics.other_names.join(' • ')}
                          </p>
                        )}
                        {/* Mobile stats display */}
                        <div className='sm:hidden flex flex-col gap-3 mt-3 text-black dark:text-white'>
                          <div className='flex items-center gap-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5'
                              viewBox='0 0 24 24'
                            >
                              <path
                                fill='currentColor'
                                d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z'
                              />
                            </svg>
                            <span className='min-w-[90px]'>Tác giả</span>
                            <span className='text-primary font-medium'>{dataComics.authors}</span>
                          </div>
                          <div className='flex items-center gap-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5'
                              viewBox='0 0 24 24'
                            >
                              <path
                                fill='currentColor'
                                d='M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6c0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6c0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4l-4-4v3z'
                              />
                            </svg>
                            <span className='min-w-[90px]'>Tình trạng</span>
                            <span
                              className={`font-medium px-2 py-0.5 rounded text-sm ${
                                dataComics.status === 'ONGOING'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              }`}
                            >
                              {dataComics.status === 'ONGOING' ? 'Đang cập nhật' : 'Đã hoàn thành'}
                            </span>
                          </div>
                          <div className='flex items-center gap-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5'
                              viewBox='0 0 24 24'
                            >
                              <path
                                fill='currentColor'
                                d='m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z'
                              />
                            </svg>
                            <span className='min-w-[90px]'>Lượt thích</span>
                            <span className='font-medium text-[#ff6b6b]'>
                              {formatCurrency(dataComics.total_likes)}
                            </span>
                          </div>
                          <div className='flex items-center gap-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5'
                              viewBox='0 0 24 24'
                            >
                              <path
                                fill='currentColor'
                                d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z'
                              />
                            </svg>
                            <span className='min-w-[90px]'>Lượt theo dõi</span>
                            <span className='font-medium text-[#64d363]'>
                              {formatCurrency(dataComics.followers)}
                            </span>
                          </div>
                          <div className='flex items-center gap-3'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-5 h-5'
                              viewBox='0 0 24 24'
                            >
                              <path
                                fill='currentColor'
                                d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3'
                              />
                            </svg>
                            <span className='min-w-[90px]'>Lượt xem</span>
                            <span className='font-medium text-[#4b8fd7]'>
                              {formatCurrency(dataComics.total_views)}
                            </span>
                          </div>
                        </div>

                        {/* Desktop stats display */}
                        <div className='hidden sm:block text-black dark:text-white'>
                          <div className='flex flex-col gap-2'>
                            <span className='text-base capitalize'>
                              tác giả:{' '}
                              <strong className='text-primary'>{dataComics.authors}</strong>
                            </span>
                            <span className='text-base capitalize flex items-center gap-1'>
                              tình trạng:{' '}
                              <span
                                className={`font-medium px-2 py-0.5 rounded text-sm ${
                                  dataComics.status === 'ONGOING'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                }`}
                              >
                                {dataComics.status === 'ONGOING'
                                  ? 'Đang cập nhật'
                                  : 'Đã hoàn thành'}
                              </span>
                            </span>
                          </div>
                          <p className='flex flex-wrap items-center gap-x-6 gap-y-2 text-base mt-3'>
                            <span className='flex items-center gap-1'>
                              <span>Lượt xem: </span>
                              <strong className='text-[#4b8fd7]'>
                                {formatCurrency(dataComics.total_views)}
                              </strong>
                            </span>
                            <span className='flex items-center gap-1'>
                              <span>Theo dõi: </span>
                              <strong className='text-[#64d363]'>
                                {formatCurrency(dataComics.followers)}
                              </strong>
                            </span>
                            <span className='flex items-center gap-1'>
                              <span>Lượt thích: </span>
                              <strong className='text-[#ff6b6b]'>
                                {formatCurrency(dataComics.total_likes)}
                              </strong>
                            </span>
                          </p>
                        </div>
                        <div className='flex flex-wrap gap-[6px] items-center my-2 mb-3 dark:text-white'>
                          {dataComics.genres.map((genre) => {
                            return genre.id !== undefined ? (
                              <Link
                                to={{
                                  pathname: PATH.genres,
                                  search: createSearchParams({
                                    type: genre.slug_genre,
                                    page: '1'
                                  }).toString()
                                }}
                                title={genre.name}
                                key={genre.id}
                              >
                                <span className='py-1 px-2 text-[13px] border border-dashed border-[#d9d9d9] hover:text-primary truncate focus:outline-none'>
                                  {genre.name}
                                </span>
                              </Link>
                            ) : null
                          })}
                        </div>
                        <div className='relative'>
                          <p
                            ref={description}
                            className={`text-base text-black/70 dark:text-gray-300 whitespace-pre-line text-left ${
                              !isOpen ? 'overflow-hidden max-h-[72px]' : ''
                            }`}
                            dangerouslySetInnerHTML={{ __html: dataComics.description }}
                          />
                          {isShow && (
                            <button
                              title={isOpen ? 'Thu gọn mô tả' : 'Xem thêm mô tả'}
                              onClick={() => setIsOpen((prev) => !prev)}
                              className={`${
                                !isOpen
                                  ? 'absolute right-0 bg-white/90 dark:bg-gray-900/90 rounded-full bottom-0 z-10 min-w-[60px] px-2 overflow-hidden'
                                  : ''
                              }`}
                            >
                              <span className='text-black dark:text-white font-medium whitespace-nowrap'>
                                {isOpen ? 'Show less' : '...more'}
                              </span>
                            </button>
                          )}
                        </div>
                        <div className='flex items-center justify-center sm:justify-start gap-3 mt-4 sm:mt-2'>
                          <Link
                            title={
                              lastReadChapter
                                ? `Đọc tiếp ${lastReadChapter.name}`
                                : 'Đọc ngay chương mới nhất'
                            }
                            to={`${PATH.comics}/${slug}-${id}/${
                              lastReadChapter
                                ? lastReadChapter.slug_chapter
                                : dataComics.chapters[dataComics.chapters.length - 1].slug_chapter
                            }/${
                              lastReadChapter
                                ? lastReadChapter.id
                                : dataComics.chapters[dataComics.chapters.length - 1].id
                            }`}
                            className={`text-white flex-shrink-0 w-full sm:w-auto min-w-[180px] h-[42px] sm:h-[42px] capitalize font-semibold flex items-center justify-center rounded gap-2 px-4 ${
                              lastReadChapter
                                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                                : 'bg-gradient'
                            }`}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              xmlnsXlink='http://www.w3.org/1999/xlink'
                              aria-hidden='true'
                              className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0'
                              viewBox='0 0 32 32'
                            >
                              <path
                                fill='currentColor'
                                d='M19 10h7v2h-7zm0 5h7v2h-7zm0 5h7v2h-7zM6 10h7v2H6zm0 5h7v2H6zm0 5h7v2H6z'
                              />
                              <path
                                fill='currentColor'
                                d='M28 5H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.002 2.002 0 0 0 2-2V7a2.002 2.002 0 0 0-2-2ZM4 7h11v18H4Zm13 18V7h11v18Z'
                              />
                            </svg>
                            <span className='truncate text-sm sm:text-base'>
                              {lastReadChapter ? `Đọc tiếp ${lastReadChapter.name}` : 'Đọc Ngay'}
                            </span>
                          </Link>

                          {/* Follow Button */}
                          <button
                            disabled={isFollowing}
                            className={`hidden sm:flex items-center gap-2 h-[42px] px-4 rounded font-medium transition-all duration-200 ${
                              isFollowing ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                              dataComics?.is_follow
                                ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-blue-300/50 dark:hover:shadow-blue-900/50'
                                : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:shadow-sm focus:outline-none'
                            }`}
                            onClick={handleFollow}
                          >
                            {isFollowing ? (
                              <svg
                                className='animate-spin h-5 w-5'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                            ) : dataComics?.is_follow ? (
                              <FaUserCheck className='w-5 h-5' />
                            ) : (
                              <FaUserPlus className='w-5 h-5' />
                            )}
                            <span>{dataComics?.is_follow ? 'Đã theo dõi' : 'Theo dõi'}</span>
                          </button>

                          {/* Like Button */}
                          <button
                            disabled={isLiking}
                            className={`hidden sm:flex items-center gap-2 h-[42px] px-4 rounded font-medium transition-all duration-200 ${
                              isLiking ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                              dataComics?.is_like
                                ? 'bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 shadow-md hover:shadow-rose-300/50 dark:hover:shadow-rose-900/50'
                                : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-sm focus:outline-none'
                            }`}
                            onClick={handleLike}
                          >
                            {isLiking ? (
                              <svg
                                className='animate-spin h-5 w-5'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                            ) : dataComics?.is_like ? (
                              <AiFillHeart className='w-5 h-5' />
                            ) : (
                              <AiOutlineHeart className='w-5 h-5' />
                            )}
                            <span>{dataComics?.is_like ? 'Đã thích' : 'Yêu thích'}</span>
                          </button>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className='flex sm:hidden items-center gap-2 mt-3'>
                          <button
                            disabled={isFollowing}
                            className={`flex-1 h-10 flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 ${
                              isFollowing ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                              dataComics?.is_follow
                                ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-blue-300/50 dark:hover:shadow-blue-900/50'
                                : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:shadow-sm focus:outline-none'
                            }`}
                            onClick={handleFollow}
                          >
                            {isFollowing ? (
                              <svg
                                className='animate-spin h-4 w-4'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                            ) : dataComics?.is_follow ? (
                              <FaUserCheck className='w-4 h-4' />
                            ) : (
                              <FaUserPlus className='w-4 h-4' />
                            )}
                            <span>{dataComics?.is_follow ? 'Đã theo dõi' : 'Theo dõi'}</span>
                          </button>

                          <button
                            disabled={isLiking}
                            className={`flex-1 h-10 flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 ${
                              isLiking ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                              dataComics?.is_like
                                ? 'bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 shadow-md hover:shadow-rose-300/50 dark:hover:shadow-rose-900/50'
                                : 'border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-sm focus:outline-none'
                            }`}
                            onClick={handleLike}
                          >
                            {isLiking ? (
                              <svg
                                className='animate-spin h-4 w-4'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                            ) : dataComics?.is_like ? (
                              <AiFillHeart className='w-4 h-4' />
                            ) : (
                              <AiOutlineHeart className='w-4 h-4' />
                            )}
                            <span>{dataComics?.is_like ? 'Đã thích' : 'Yêu thích'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {isMainContentLoading && <ComicsDetailHeroSkeleton />}
                </div>

                {/* Affiliate Notice - Between description and chapter list */}
                <div className='px-4 sm:px-0 my-4'>
                  <AffiliateNotice />
                </div>

                <div className='flex flex-col md:flex-row gap-4 lg:gap-[30px] justify-between'>
                  <div className='flex-1 max-w-[852px]'>
                    <section className='min-h-[400px] px-4 sm:px-0' style={{ contain: 'layout' }}>
                      <h2 className='flex items-center gap-2 border-b border-slate-200 dark:border-gray-500 pb-1 capitalize text-primary text-lg'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          xmlnsXlink='http://www.w3.org/1999/xlink'
                          aria-hidden='true'
                          className='w-6 h-6 flex-shrink-0 text-primary'
                          viewBox='0 0 32 32'
                        >
                          <path
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M16 7S9 1 2 6v22c7-5 14 0 14 0s7-5 14 0V6c-7-5-14 1-14 1Zm0 0v21'
                          />
                        </svg>
                        Danh sách chương
                      </h2>
                      {dataComics && !isMainContentLoading && slug && id && (
                        <ListChapter slug={slug} data={dataComics.chapters} id={id} />
                      )}
                      {isMainContentLoading && skeletonListChapter()}
                    </section>

                    <section className='mt-2'>{id && <ListComment id={id} />}</section>
                    {dataComics?.id && <RecommendComics comicId={Number(dataComics.id)} />}
                  </div>
                  <div className='flex-shrink-0 w-[238px] hidden md:flex flex-col gap-6'>
                    <>
                      <h3 className='px-5 pl-3 py-3 border dark:border-gray-500 flex items-center font-semibold text-lg text-black dark:text-white'>
                        Top tuần
                      </h3>
                      <div
                        className='border border-t-0 dark:border-gray-500 flex flex-col -mt-6 min-h-[600px]'
                        style={{ contain: 'layout' }}
                      >
                        {dataWeeklyComics &&
                          dataWeeklyComics
                            .slice(0, 10)
                            .map((item, i) => (
                              <SuggestComics
                                key={item.id}
                                index={i}
                                title={item.title}
                                src={item.thumbnail}
                                idChapter={item.last_chapter.id}
                                chapter={item.last_chapter.name}
                                genres={item.genres.map((item) => item.name) as [string]}
                                idComic={item.id}
                                slug={item.slug}
                                slugChapter={item.last_chapter.slug_chapter}
                              />
                            ))}
                        {isLoadingWeekly && !dataWeeklyComics && (
                          <SidebarComicsSkeleton count={10} />
                        )}
                      </div>
                    </>
                    <div className='sticky top-[50px]'>
                      <h3 className='px-5 pl-3 py-3 border dark:border-gray-500 flex items-center font-semibold text-lg text-black dark:text-white'>
                        Nổi bật
                      </h3>
                      <div
                        className='border border-t-0 dark:border-gray-500 flex flex-col min-h-[600px]'
                        style={{ contain: 'layout' }}
                      >
                        {dataPopularComics &&
                          dataPopularComics
                            .slice(0, 7)
                            .map((item, i) => (
                              <SuggestComics
                                key={item.id}
                                index={i}
                                title={item.title}
                                src={item.thumbnail}
                                idChapter={item.last_chapter.id}
                                chapter={item.last_chapter.name}
                                genres={item.genres.map((item) => item.name) as [string]}
                                idComic={item.id}
                                slug={item.slug}
                                slugChapter={item.last_chapter.slug_chapter}
                              />
                            ))}
                        {isLoadingPopular && !dataPopularComics && (
                          <SidebarComicsSkeleton count={7} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onMouseDown={() => {
              setIsOpenModal(false)
              document.body.style.overflow = 'auto'
            }}
            className={`fixed inset-0 bg-[rgba(0,0,0,.6)] z-30 flex flex-col items-center justify-center duration-500 transition-all ${
              isOpenModal ? ' opacity-100 pointer-events-auto' : ' opacity-0 pointer-events-none'
            }`}
          >
            <div
              className='bg-white dark:bg-gray-900 p-5 rounded-lg'
              onMouseDown={(e) => e.stopPropagation()}
            >
              <section className='w-full sm:w-[450px] md:w-[550px] lg:w-[700px]'>
                {dataComics && id && <ListDownloadChapter id={id} data={dataComics.chapters} />}
              </section>
            </div>
          </div>
        </>
      )}
      {(isError || Number(dataComics?.status) === 404) && <NotFound />}
    </>
  )
}
export default ComicsDetail

const skeletonListChapter = () => {
  return (
    <div className='border rounded-lg p-2 sm:p-4 dark:border-gray-700 shadow-sm animate-pulse'>
      {/* Toolbar Skeleton - Match ListChapter */}
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 sm:items-center'>
        <div className='relative flex-1'>
          <div className='w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg' />
          <div className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded' />
        </div>
        <div className='w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg' />
      </div>

      {/* Header Skeleton - Match ListChapter */}
      <div className='grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-md text-sm sm:text-base'>
        <div className='col-span-6'>
          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-20' />
        </div>
        <div className='col-span-3'>
          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16' />
        </div>
        <div className='col-span-3 text-right'>
          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 ml-auto' />
        </div>
      </div>

      {/* Virtual Chapter List Skeleton - Match ListChapter */}
      <div className='h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
        <div className='space-y-0'>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className='grid grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 sm:py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-dashed dark:border-gray-700'
            >
              {/* Chapter Name */}
              <div className='col-span-6 flex items-center'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-48' />
              </div>

              {/* Update Date */}
              <div className='col-span-3 flex items-center'>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-16' />
              </div>

              {/* View Count */}
              <div className='col-span-3 text-right flex items-center justify-end'>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-12' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
