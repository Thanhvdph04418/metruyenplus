import { Helmet } from 'react-helmet-async'
import PATH from '@/utils/path'
import { comicSingleChapter } from '@/types/data'

interface UseChapterSEOParams {
  dataComics: any
  dataChapter: comicSingleChapter | undefined
  chapterInfo: any
  comicIndentify: string
  idChapter: string
}

/**
 * Hook to generate SEO meta tags for chapter pages
 * Includes structured data (JSON-LD) and pagination links
 */
export const useChapterSEO = ({
  dataComics,
  dataChapter,
  chapterInfo,
  comicIndentify,
  idChapter
}: UseChapterSEOParams) => {
  if (!dataComics || !dataChapter || !chapterInfo) {
    return null
  }

  const title = `${dataComics?.title} ${chapterInfo?.name} - nettruyen`
  const description = `Đọc truyện ${dataComics?.title} ${chapterInfo?.name} miễn phí, không quảng cáo tại nettruyen. Cập nhật nhanh nhất, chất lượng cao, không quảng cáo, luôn luôn lắng nghe người dùng.`
  const keywords = `${dataComics?.title}, ${chapterInfo?.name}, truyện tranh, manga, manhua, manhwa, comic, webtoon , ${dataComics?.genres
    ?.map((g: any) => g.name)
    .join(', ')}`
  const image = dataChapter?.images[0]?.src
  const canonicalUrl = `https://nettruyenfanq.com${PATH.comics}/${comicIndentify}/${chapterInfo?.slug_chapter}/${idChapter}`
  const ogUrl = `https://nettruyenfanq.com${PATH.comics}/${comicIndentify}/${chapterInfo?.slug_chapter}/${idChapter}`

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${dataComics?.title} - ${chapterInfo?.name}`,
    image: image,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'nettruyen'
    },
    publisher: {
      '@type': 'Organization',
      name: 'nettruyen',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nettruyenfanq.com/logo.png'
      }
    },
    isPartOf: {
      '@type': 'Comic',
      name: dataComics?.title,
      url: `https://nettruyenfanq.com${PATH.comics}/${comicIndentify}`,
      description: dataComics?.description,
      author: dataComics?.authors,
      genre: dataComics?.genres?.map((genre: any) => genre.name).join(', ')
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://nettruyenfanq.com${PATH.comics}/${comicIndentify}/${chapterInfo?.slug_chapter}/${idChapter}`
    },
    description: `Đọc truyện ${dataComics?.title} ${chapterInfo?.name} miễn phí tại nettruyen`
  }

  // Pagination links
  const prevChapter = dataChapter.chapters.find(
    (chapter: any) => Number(chapter.id) === Number(idChapter) - 1
  )
  const nextChapter = dataChapter.chapters.find(
    (chapter: any) => Number(chapter.id) === Number(idChapter) + 1
  )

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <meta name='author' content='nettruyen' />
      <meta name='robots' content='index, follow' />
      <link rel='canonical' href={canonicalUrl} />

      {/* Open Graph Tags - Enhanced */}
      <meta property='og:type' content='article' />
      <meta property='og:site_name' content='nettruyen' />
      <meta property='og:title' content={`${dataComics?.title} - ${chapterInfo?.name}`} />
      <meta
        property='og:description'
        content={`Đọc truyện ${dataComics?.title} ${chapterInfo?.name} và hàng ngàn chương truyện khác tại nettruyen - Cộng đồng đọc truyện tranh online lớn nhất Việt Nam`}
      />
      <meta property='og:image' content={image} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:locale' content='vi_VN' />
      <meta
        property='og:url'
        content={ogUrl}
        title={`${dataComics?.title} - ${chapterInfo?.name}`}
      />

      {/* Twitter Card Tags - Enhanced */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@nettruyen' />
      <meta name='twitter:title' content={`${dataComics?.title} - ${chapterInfo?.name}`} />
      <meta
        name='twitter:description'
        content={`Đọc truyện ${dataComics?.title} ${chapterInfo?.name} và hàng ngàn chương truyện khác tại nettruyen - Cộng đồng đọc truyện tranh online lớn nhất Việt Nam`}
      />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:image:alt' content={`${dataComics?.title} chapter cover`} />

      {/* Enhanced Structured Data */}
      <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>

      {/* Enhanced Pagination Links */}
      {prevChapter && (
        <link
          rel='prev'
          href={`https://nettruyenfanq.com${PATH.comics}/${comicIndentify}/${
            prevChapter.slug_chapter
          }/${Number(idChapter) - 1}`}
        />
      )}
      {nextChapter && (
        <link
          rel='next'
          href={`https://nettruyenfanq.com${PATH.comics}/${comicIndentify}/${
            nextChapter.slug_chapter
          }/${Number(idChapter) + 1}`}
        />
      )}
    </Helmet>
  )
}
