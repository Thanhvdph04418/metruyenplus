import { Header, ScrollToTop, SearchBar } from '@/components'
import { useMediaQuery } from 'react-responsive'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { usePageTracking } from '@/hooks/useAnalytics'

const ChapterLayout = () => {
  const isMobileMini = useMediaQuery({ maxWidth: 639 })

  // Track page views for chapter reading routes
  usePageTracking()

  return (
    <>
      <header id='site-header'>
        <Header />
      </header>
      <main>
        {!isMobileMini && <SearchBar />}
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
