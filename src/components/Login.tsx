import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import PATH from '@/utils/path'
import comicApis from '@/apis/comicApis'
import { syncReadingHistory } from '@/utils/history'
import { useGoogleLogin } from '@react-oauth/google'
import useScrollOnReload from '@/hooks/useScrollOnReload'
import { trackAuth } from '@/utils/analytics'
import '@/types/turnstile'

interface LoginFormData {
  username: string
  password: string
}

const GoogleIcon = () => (
  <svg className='w-5 h-5' aria-hidden='true' fill='currentColor' viewBox='0 0 48 48'>
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

// Move these to a separate components file
const SocialButton = ({
  provider,
  icon: Icon,
  onClick,
  disabled
}: {
  provider: string
  icon: React.ComponentType
  onClick: () => void
  disabled: boolean
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className='flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
    aria-label={`Sign in with ${provider}`}
  >
    <Icon />
    <span className='ml-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200'>
      {provider}
    </span>
  </button>
)

const FormDivider = ({ text }: { text: string }) => (
  <div className='relative my-6'>
    <div className='absolute inset-0 flex items-center'>
      <div className='w-full border-t border-gray-300 dark:border-gray-600' />
    </div>
    <div className='relative flex justify-center text-xs sm:text-sm'>
      <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
        {text}
      </span>
    </div>
  </div>
)

const Login = () => {
  useScrollOnReload()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null)

  // Load Cloudflare Turnstile script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsTurnstileLoaded(true)
    }

    script.onerror = () => {
      setError('Không thể tải xác thực captcha')
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      // Clean up widget if it exists
      if (turnstileWidgetId && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId)
      }
    }
  }, [])

  // Render Turnstile widget when script is loaded
  useEffect(() => {
    if (isTurnstileLoaded && !turnstileWidgetId && window.turnstile) {
      try {
        const widgetId = window.turnstile.render('#turnstile-container', {
          sitekey: import.meta.env.VITE_CAPTCHA_KEY_TURNSTILE,
          theme: 'auto',
          action: 'login',
          callback: (token: string) => {
            setTurnstileToken(token)
            setError('')
          },
          'error-callback': () => {
            setError('Xác thực captcha thất bại')
            setTurnstileToken(null)
          },
          'expired-callback': () => {
            setError('Captcha đã hết hạn, vui lòng thử lại')
            setTurnstileToken(null)
          }
        })
        setTurnstileWidgetId(widgetId)
      } catch (err) {
        setError('Không thể khởi tạo captcha')
      }
    }
  }, [isTurnstileLoaded, turnstileWidgetId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (!turnstileToken) {
        throw new Error('Vui lòng hoàn thành xác thực captcha')
      }

      setIsLoading(true)

      try {
        const response = await comicApis.login({
          username: formData.username,
          password: formData.password,
          tokenCaptcha: turnstileToken
        })

        if (response?.data?.token) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('customerInfo', JSON.stringify(response.data.customerInfo))
          await syncReadingHistory(response.data.token)

          // Track successful email login
          trackAuth({
            method: 'email',
            action: 'login'
          })

          const from = location.state?.from?.pathname || PATH.home
          navigate(from, { replace: true })
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        // Reset Turnstile widget on error
        if (turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId)
          setTurnstileToken(null)
        }
        throw error
      } finally {
        setIsLoading(false)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sai tên đăng nhập hoặc mật khẩu'
      setError(message)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        if (!isTurnstileLoaded) {
          throw new Error('Captcha chưa sẵn sàng')
        }
        setIsLoading(true)

        const result = await comicApis.loginWithGoogle(response.access_token)

        if (result?.data?.token) {
          localStorage.setItem('auth_token', result.data.token)
          localStorage.setItem('customerInfo', JSON.stringify(result.data.customerInfo))
          await syncReadingHistory(result.data.token)

          // Track successful Google login
          trackAuth({
            method: 'google',
            action: 'login'
          })

          const from = location.state?.from?.pathname || PATH.home
          window.location.href = from
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      setError('Đăng nhập thất bại')
    }
  })

  const handleGoogleLogin = async () => {
    try {
      if (!isTurnstileLoaded) {
        throw new Error('Captcha chưa sẵn sàng')
      }
      googleLogin()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi'
      setError(errorMessage)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-6' aria-label='Login form'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='username'
              className='block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Tên đăng nhập ( Email )
            </label>
            <div className='mt-1 relative'>
              <input
                id='username'
                name='username'
                type='text'
                required
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                className='block w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200'
                placeholder='your@username.com'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Mật khẩu
            </label>
            <div className='mt-1 relative'>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className='block w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200'
                placeholder='••••••••'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className='text-sm text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-lg'>
            {error}
          </div>
        )}

        {/* Cloudflare Turnstile Widget */}
        <div id='turnstile-container' className='flex justify-center my-4'></div>

        <button
          type='submit'
          disabled={isLoading || !isTurnstileLoaded || !turnstileToken}
          className='w-full flex justify-center py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-primary'
        >
          {isLoading ? (
            <div className='flex items-center space-x-2'>
              <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              <span className='text-xs sm:text-sm'>Đang đăng nhập...</span>
            </div>
          ) : (
            'Đăng nhập'
          )}
        </button>

        <FormDivider text='Hoặc tiếp tục với' />

        <div className='flex justify-center'>
          <SocialButton
            provider='Google'
            icon={GoogleIcon}
            onClick={handleGoogleLogin}
            disabled={isLoading || !isTurnstileLoaded}
          />
        </div>

        <div className='text-center text-xs sm:text-sm'>
          <p className='text-gray-600 dark:text-gray-400 space-x-2'>
            <span>Không có tài khoản?</span>
            <Link
              to={PATH.signup}
              className='font-medium text-primary hover:text-primary/90 transition-colors duration-200'
              title='Đăng ký'
            >
              Đăng ký
            </Link>
            <span>·</span>
            <Link
              to={PATH.forgotPassword}
              className='font-medium text-primary hover:text-primary/90 transition-colors duration-200'
              title='Quên mật khẩu'
            >
              Quên mật khẩu?
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}

export default Login
