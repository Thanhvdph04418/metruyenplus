import { Helmet } from 'react-helmet-async'
import SiteMap from '@/components/SiteMap'
import useScrollTop from '../hooks/useScrollTop'

const SitemapPage = () => {
  useScrollTop()
  return (
    <>
      <Helmet>
        <title>Sitemap - MeTruyen+</title>
        <meta name='description' content='Sitemap của MeTruyen+ - Tất cả các đường dẫn trên website' />
      </Helmet>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-black dark:text-white mb-6'>SƠ ĐỒ TRANG WEB</h1>
        <SiteMap />
      </div>
    </>
  )
}

export default SitemapPage
