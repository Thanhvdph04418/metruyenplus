import { Helmet } from 'react-helmet-async'

export interface SEOConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Hook for SEO meta tags management
 * Returns Helmet component with all SEO tags configured
 * @param config - SEO configuration object
 * @returns Helmet JSX element
 */
export const useSEO = (config: SEOConfig) => {
  const {
    title = 'nettruyen - Đọc truyện tranh online',
    description = 'Đọc truyện tranh online miễn phí, cập nhật liên tục',
    image = '/default-og-image.jpg',
    url = window.location.href,
    type = 'website',
    keywords = [],
    author,
    publishedTime,
    modifiedTime
  } = config

  const fullTitle = title.includes('nettruyen') ? title : `${title} - nettruyen`

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      {keywords.length > 0 && <meta name='keywords' content={keywords.join(', ')} />}
      {author && <meta name='author' content={author} />}

      {/* Open Graph */}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:url' content={url} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content='nettruyen' />

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Article meta (if type is article) */}
      {type === 'article' && publishedTime && (
        <meta property='article:published_time' content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property='article:modified_time' content={modifiedTime} />
      )}

      {/* Canonical URL */}
      <link rel='canonical' href={url} />
    </Helmet>
  )
}
