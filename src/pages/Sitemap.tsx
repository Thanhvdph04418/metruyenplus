import { Helmet } from 'react-helmet-async'
import SiteMap from '@/components/SiteMap'
import useScrollTop from '../hooks/useScrollTop'
import { SITE_NAME } from '@/config/siteConfig'

const SitemapPage = () => {
  useScrollTop()
  return (
    <>
      <Helmet>
        <title>{`Sitemap - ${SITE_NAME}`}</title>
        <meta
          name='description'
          content={`Sitemap của ${SITE_NAME} - Tất cả các đường dẫn trên website`}
        />
      </Helmet>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-black dark:text-white mb-6'>SƠ ĐỒ TRANG WEB</h1>
        <SiteMap />
      </div>
    </>
  )
}

export default SitemapPage
