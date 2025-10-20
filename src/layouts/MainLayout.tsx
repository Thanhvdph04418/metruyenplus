import { Footer, Header, Navbar, ScrollToTop, SearchBar, LunarNewYearCouplets, MobileBottomTab } from '@/components'
import { useMediaQuery } from 'react-responsive'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { usePageTracking } from '@/hooks/useAnalytics'

const MainLayout = ({ hideNav = false }: { hideNav?: boolean }) => {
  const isMobileMini = useMediaQuery({ maxWidth: 639 })

  // Track page views for all routes using this layout
  usePageTracking()

  return (
    <>
      <header className='sticky top-0 z-30 left-0 right-0' id='site-header'>
        <Header />
      </header>
      <main className='pb-16 sm:pb-0'>
        {!isMobileMini && <SearchBar />}
        {!hideNav && <Navbar />}
        <Outlet />
        <ScrollRestoration />
        <div className='hidden md:block'>
          <ScrollToTop />
        </div>
      </main>
      <Footer />
      <LunarNewYearCouplets enabled={true} />
      <MobileBottomTab />
    </>
  )
}

export default MainLayout
