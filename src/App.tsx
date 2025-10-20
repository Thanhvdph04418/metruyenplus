import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import PATH from './utils/path'
import { lazy, Suspense, useEffect, useState } from 'react'
import { ChapterLayout, MainLayout } from './layouts'
import { initLocalDb } from './utils/history'
import { AuthProvider } from './context/AuthContext'
import AuthLayout from './layouts/AuthLayout'
import CustomerLayout from './layouts/CustomerLayout'
import GoogleAuthCallback from './components/GoogleAuthCallback'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { initializeAnalytics } from './utils/analytics'

const ComicsList = lazy(() => import('./pages/ComicsList'))
const ComicsGenre = lazy(() => import('./pages/ComicsGenre'))
const ComicsDetail = lazy(() => import('./pages/ComicsDetail'))
const ComicsChapter = lazy(() => import('./pages/ComicsChapter'))
const ComicsSearch = lazy(() => import('./pages/ComicsSearch'))
const Home = lazy(() => import('./pages/Home'))
const History = lazy(() => import('./pages/History'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const AppLanding = lazy(() => import('./pages/AppLanding'))
const Login = lazy(() => import('./components/Login'))
const Signup = lazy(() => import('./components/Signup'))
const Customer = lazy(() => import('./components/Customer'))
const ForgotPassword = lazy(() => import('./components/ForgotPassword'))
const MobileLogin = lazy(() => import('./components/MobileLogin'))
const SitemapPage = lazy(() => import('./pages/Sitemap'))

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize the local database
    initLocalDb()
      .then(() => {
        setIsInitialized(true)
      })
      .catch((error) => {
        console.error('Failed to initialize local database:', error)
        setIsInitialized(true) // Still mark as initialized so the app can continue
        setInitError(error instanceof Error ? error.message : 'An unknown error occurred')
      })

    // Initialize Google Analytics
    if (
      import.meta.env.VITE_GA_MEASUREMENT_ID &&
      import.meta.env.VITE_GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
    ) {
      const analyticsInitialized = initializeAnalytics()
      if (analyticsInitialized) {
        console.log('Google Analytics initialized successfully')
      }
    }

    // Setup theme
    document.body.classList.add('dark:bg-gray-900')
    if (!localStorage.theme) {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.add(localStorage.theme as string)
    }
  }, [])

  // Show loading until initialization is complete
  if (!isInitialized) {
    return <LoadingPage />
  }

  // Show error notification if there was an initialization error
  const errorMessage = initError ? (
    <div
      className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed top-4 right-4 z-50'
      role='alert'
    >
      <strong className='font-bold'>Database Error:</strong>
      <span className='block sm:inline'> History feature may not work properly.</span>
    </div>
  ) : null

  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: PATH.login,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Login />
            </Suspense>
          )
        },
        {
          path: PATH.signup,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Signup />
            </Suspense>
          )
        },
        {
          path: PATH.forgotPassword,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ForgotPassword />
            </Suspense>
          )
        }
      ]
    },
    {
      element: <CustomerLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: PATH.customerInfo,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Customer />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          path: PATH.home,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <Home />
            </Suspense>
          )
        },
        {
          path: PATH.recent,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.recommend,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.popular,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.completed,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.boy,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.girl,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.new,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.top,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: `${PATH.top}/${PATH.type}`,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsList />
            </Suspense>
          )
        },
        {
          path: PATH.history,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <History />
            </Suspense>
          )
        },
        {
          path: PATH.privatePolicy,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <PrivacyPolicy />
            </Suspense>
          )
        },
        {
          path: PATH.app,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <AppLanding />
            </Suspense>
          )
        },
        {
          path: PATH.sitemap,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <SitemapPage />
            </Suspense>
          )
        }
      ]
    },
    {
      element: <MainLayout hideNav={true} />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: PATH.genres,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsGenre />
            </Suspense>
          )
        },
        {
          path: `${PATH.comics}/${PATH.name}`,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsDetail />
            </Suspense>
          )
        },
        {
          path: PATH.search,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsSearch />
            </Suspense>
          )
        }
      ]
    },
    {
      element: <ChapterLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: `${PATH.comics}/${PATH.name}/${PATH.slugChapter}/${PATH.idChapter}`,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ComicsChapter />
            </Suspense>
          )
        }
      ]
    },
    {
      element: <MainLayout />,
      children: [
        {
          path: '*',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <NotFound />
            </Suspense>
          )
        }
      ]
    },
    {
      path: `${PATH.login}${PATH.googleCallback}`,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GoogleAuthCallback />
        </Suspense>
      )
    },
    {
      path: PATH.mobileLogin,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <MobileLogin />
        </Suspense>
      )
    }
  ])
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        {errorMessage}
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App

function LoadingPage() {
  return (
    <div role='status' className='flex h-screen flex-col items-center justify-center gap-2'>
      <svg
        aria-hidden='true'
        className='mr-2 h-16 w-16 animate-spin fill-primary text-gray-200 dark:text-white'
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
    </div>
  )
}

export function NotFound() {
  return (
    <div role='status' className='flex h-screen flex-col items-center justify-center gap-4'>
      <h2 className='text-7xl md:text-9xl font-black text-primary'>404</h2>
      <p className='text-3xl text-black dark:text-white'>Không tìm thấy trang</p>
    </div>
  )
}

function ErrorBoundary() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 1500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <main role='status' className='flex h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-7xl md:text-9xl font-black text-primary'>500</h1>
      <p className='text-3xl text-black dark:text-white'>Đã xảy ra lỗi</p>
      <a
        href='/'
        className='mt-4 rounded-lg bg-orange px-6 py-2 text-white text-xl shadow bg-primary'
      >
        Trở về trang chủ
      </a>
    </main>
  )
}
