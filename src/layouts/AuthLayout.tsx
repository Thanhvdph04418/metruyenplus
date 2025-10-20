import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header, Footer } from '@/components'
import PATH from '@/utils/path'
import { usePageTracking } from '@/hooks/useAnalytics'

const AuthLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('auth_token')

  // Track page views for auth routes
  usePageTracking()

  useEffect(() => {
    // Only handle customer info route protection
    if (!token && location.pathname === PATH.customerInfo) {
      console.log('Run redirect to login')
      navigate(PATH.login, {
        state: { from: location },
        replace: true
      })
      return
    }

    // Only redirect on successful auth (avoid redirect on login failure)
    if (
      token &&
      [PATH.login, PATH.signup].includes(location.pathname as any) &&
      !location.state?.error // Add this check to prevent redirect on error
    ) {
      console.log('Run redirect to customer info')
      const from = location.state?.from?.pathname || PATH.customerInfo
      navigate(from, { replace: true })
    }
  }, [location.pathname]) // Remove navigate from dependencies

  const getAuthInfo = () => {
    switch (location.pathname) {
      case PATH.login:
        return {
          title: 'Chào mừng trở lại!',
          subtitle: 'Vui lòng đăng nhập để tiếp tục'
        }
      case PATH.signup:
        return {
          title: 'Tạo tài khoản',
          subtitle: 'Tham gia cộng đồng truyện tranh'
        }
      case PATH.customerInfo:
        return {
          title: 'Thông tin cá nhân',
          subtitle: 'Vui lòng điền đầy đủ thông tin cá nhân'
        }
      case PATH.forgotPassword:
        return {
          title: 'Quên mật khẩu',
          subtitle: 'Vui lòng nhập email để đặt lại mật khẩu'
        }
      default:
        return {
          title: 'Xác thực',
          subtitle: 'Vui lòng xác thực để tiếp tục'
        }
    }
  }

  const { title, subtitle } = getAuthInfo()

  // Don't show layout for authenticated users on login/signup pages
  if (token && [PATH.login, PATH.signup].includes(location.pathname as any)) {
    return null
  }

  return (
    <>
      <header className='sticky top-0 z-20 left-0 right-0' id='site-header'>
        <Header />
      </header>

      <main className='min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex flex-col items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900'>
        <div className='w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 relative z-10'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>{title}</h2>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{subtitle}</p>
          </div>

          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default AuthLayout
