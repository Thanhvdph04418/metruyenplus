import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import comicApis from '@/apis/comicApis'
import { syncReadingHistory } from '@/utils/history'
import { useGoogleLogin } from '@react-oauth/google'
import useScrollOnReload from '@/hooks/useScrollOnReload'
import { trackAuth } from '@/utils/analytics'

enum AuthState {
  LOADING = 'loading', // Đang load reCAPTCHA
  READY_TO_AUTH = 'ready_to_auth', // Sẵn sàng auth, chờ user click
  AUTH_PENDING = 'auth_pending', // Đang Google Auth
  CONFIRMATION = 'confirmation', // Xác nhận với user
  REDIRECTING = 'redirecting', // Đang redirect
  ERROR = 'error' // Lỗi
}

interface UserInfo {
  name?: string
  email?: string
  avatar?: string
}

// Whitelist domains được phép sử dụng deeplink
const ALLOWED_DEEPLINK_DOMAINS = [
  'tcomic://'
  // Thêm các schemes khác khi cần
]

const validateDeeplink = (deeplink: string): boolean => {
  try {
    const decodedLink = decodeURIComponent(deeplink)
    return ALLOWED_DEEPLINK_DOMAINS.some((domain) => decodedLink.startsWith(domain))
  } catch {
    return false
  }
}

const GoogleIcon = () => (
  <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 48 48'>
    <path
      fill='#FFC107'
      d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
    />
    <path
      fill='#FF3D00'
      d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
    />
    <path
      fill='#4CAF50'
      d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
    />
    <path
      fill='#1976D2'
      d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
    />
  </svg>
)

const LoadingSpinner = () => (
  <div className='flex justify-center'>
    <svg className='animate-spin h-8 w-8 text-primary' fill='none' viewBox='0 0 24 24'>
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  </div>
)

const MobileLogin = () => {
  useScrollOnReload()
  const [searchParams] = useSearchParams()
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING)
  const [error, setError] = useState('')
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({})
  const [token, setToken] = useState('')

  // Lấy params từ URL
  const deeplink = searchParams.get('deeplink') || ''
  const appName = searchParams.get('app_name') || 'Ứng dụng'
  const isTest = searchParams.get('isTest') === 'true'

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptchaScript = () => {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${
        import.meta.env.VITE_CAPTCHA_KEY_GOOGLE
      }`
      script.async = true

      script.onload = () => {
        window.grecaptcha?.ready(() => {
          setIsRecaptchaLoaded(true)
        })
      }

      document.body.appendChild(script)
      return script
    }

    const script = loadRecaptchaScript()
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Validate params và auto-trigger Google login
  useEffect(() => {
    if (!deeplink) {
      setError('Thiếu thông tin deeplink')
      setAuthState(AuthState.ERROR)
      return
    }

    if (!validateDeeplink(deeplink)) {
      setError('Deeplink không được phép')
      setAuthState(AuthState.ERROR)
      return
    }

    // Chuyển sang ready state khi reCAPTCHA loaded
    if (isRecaptchaLoaded && authState === AuthState.LOADING) {
      setAuthState(AuthState.READY_TO_AUTH)
    }
  }, [deeplink, isRecaptchaLoaded, authState])

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        if (!isRecaptchaLoaded) {
          throw new Error('reCAPTCHA không khả dụng')
        }

        const result = await comicApis.loginWithGoogle(response.access_token)

        if (result?.data?.token) {
          const customerInfo = result.data.customerInfo
          setUserInfo({
            name: customerInfo?.name || 'User',
            email: customerInfo?.email || '',
            avatar: customerInfo?.avatar || ''
          })
          setToken(result.data.token)

          // Lưu vào localStorage (tương tự Login.tsx)
          localStorage.setItem('auth_token', result.data.token)
          localStorage.setItem('customerInfo', JSON.stringify(customerInfo))
          await syncReadingHistory(result.data.token)

          // Track successful Google login
          trackAuth({
            method: 'google',
            action: 'mobile_login'
          })

          setAuthState(AuthState.CONFIRMATION)
        } else {
          throw new Error(result.message || 'Đăng nhập thất bại')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại'
        setError(errorMessage)
        setAuthState(AuthState.ERROR)
      }
    },
    onError: () => {
      setError('Đăng nhập Google thất bại')
      setAuthState(AuthState.ERROR)
    }
  })

  const handleAccept = () => {
    // Test mode: Alert token instead of redirect
    if (isTest) {
      alert(`🧪 TEST MODE - Token:\n\n${token}`)
      return
    }

    setAuthState(AuthState.REDIRECTING)

    // Construct redirect URL với token
    const separator = deeplink.includes('?') ? '&' : '?'
    const redirectUrl = `${deeplink}${separator}token=${encodeURIComponent(token)}`

    setTimeout(() => {
      window.location.href = redirectUrl
    }, 1000)
  }

  const handleDecline = () => {
    setAuthState(AuthState.ERROR)
    setError('Người dùng từ chối xác thực')
  }

  const handleStartAuth = () => {
    setAuthState(AuthState.AUTH_PENDING)
    googleLogin()
  }

  const handleRetry = () => {
    setError('')
    setAuthState(AuthState.LOADING)
    setUserInfo({})
    setToken('')
  }

  const renderContent = () => {
    switch (authState) {
      case AuthState.LOADING:
        return (
          <div className='text-center space-y-4'>
            <LoadingSpinner />
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Đang chuẩn bị xác thực...
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>Vui lòng chờ trong giây lát</p>
          </div>
        )

      case AuthState.READY_TO_AUTH:
        return (
          <div className='text-center space-y-6'>
            <div className='flex justify-center'>
              <GoogleIcon />
            </div>

            <div className='space-y-2'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                Xác thực với Google
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Đăng nhập để sử dụng <span className='font-medium'>{appName}</span>
              </p>
            </div>

            <button
              onClick={handleStartAuth}
              className='w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2'
            >
              <GoogleIcon />
              <span>Tiếp tục với Google</span>
            </button>

            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Một cửa sổ mới sẽ mở để bạn đăng nhập
            </p>
          </div>
        )

      case AuthState.AUTH_PENDING:
        return (
          <div className='text-center space-y-6'>
            <div className='flex justify-center'>
              <GoogleIcon />
            </div>
            <LoadingSpinner />
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Đang xác thực với Google...
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Một cửa sổ Google sẽ mở ra để bạn đăng nhập
            </p>
          </div>
        )

      case AuthState.CONFIRMATION:
        return (
          <div className='text-center space-y-8'>
            {/* Success Icon */}
            <div className='flex justify-center'>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>

            {/* User Info */}
            <div className='space-y-2'>
              <h2 className='text-2xl font-light text-gray-900 dark:text-gray-100'>
                Chào {userInfo.name}
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Xác thực cho <span className='font-medium'>{appName}</span>
              </p>
            </div>

            {/* Test Mode Indicator */}
            {isTest && (
              <div className='bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800'>
                <p className='text-xs text-yellow-800 dark:text-yellow-200 flex items-center justify-center space-x-1'>
                  <span>🧪</span>
                  <span className='font-medium'>TEST MODE</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className='space-y-3 pt-4'>
              <button
                onClick={handleAccept}
                className='w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
              >
                {isTest ? 'Xem Token' : 'Tiếp tục'}
              </button>

              <button
                onClick={handleDecline}
                className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200'
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        )

      case AuthState.REDIRECTING:
        return (
          <div className='text-center space-y-4'>
            <LoadingSpinner />
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Đang quay lại ứng dụng...
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Bạn sẽ được chuyển hướng trong giây lát
            </p>
          </div>
        )

      case AuthState.ERROR:
        return (
          <div className='text-center space-y-6'>
            <div className='flex justify-center'>
              <div className='w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-red-600 dark:text-red-400'>
                Xác thực thất bại
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>{error}</p>
            </div>

            <button
              onClick={handleRetry}
              className='w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-200'
            >
              Thử lại
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              Xác thực tài khoản
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
              Đăng nhập để sử dụng <strong>{appName}</strong>
            </p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MobileLogin
