import { Footer, Header, Navbar, ScrollToTop, LunarNewYearCouplets, MobileBottomTab } from '@/components'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { usePageTracking } from '@/hooks/useAnalytics'

const MainLayout = ({ hideNav = false }: { hideNav?: boolean }) => {
  usePageTracking()

  return (
    <>
      <header className='sticky top-0 z-30 left-0 right-0' id='site-header'>
        <Header />
      </header>
      <main className='pb-20 sm:pb-0'>
        {!hideNav && <Navbar />}
        <Outlet />
        <ScrollRestoration />
        <div className='hidden md:block'>
          <ScrollToTop />
        </div>
      </main>
      <Footer />
      <MobileBottomTab />
      <LunarNewYearCouplets enabled={true} />
    </>
  )
}

export default MainLayout
