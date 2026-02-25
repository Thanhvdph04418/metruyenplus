import { Header, ScrollToTop } from '@/components'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { usePageTracking } from '@/hooks/useAnalytics'

const ChapterLayout = () => {
  // Track page views for chapter reading routes
  usePageTracking()

  return (
    <>
      <header id='site-header'>
        <Header />
      </header>
      <main>
        <Outlet />
        <ScrollRestoration />
        <div className='hidden md:block'>
          <ScrollToTop />
        </div>
      </main>
    </>
  )
}

export default ChapterLayout
