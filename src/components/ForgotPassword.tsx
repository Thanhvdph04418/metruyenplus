import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import comicApis from '@/apis/comicApis'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      if (!isRecaptchaLoaded) {
        throw new Error('reCAPTCHA không khả dụng')
      }

      const tokenCaptcha = await window.grecaptcha.execute(
        import.meta.env.VITE_CAPTCHA_KEY_GOOGLE,
        { action: 'reset_password' }
      )

      setIsLoading(true)

      await comicApis.forgotPassword({
        email,
        tokenCaptcha
      })
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-[420px] mx-auto space-y-4 sm:space-y-6 sm:p-0'
      >
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            Email
          </label>
          <div className='mt-1'>
            <input
              id='email'
              name='email'
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200'
              placeholder='your@email.com'
            />
          </div>
        </div>

        {error && (
          <div className='text-xs sm:text-sm text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 py-2 px-3 sm:px-4 rounded-lg'>
            {error}
          </div>
        )}

        {success && (
          <div className='text-xs sm:text-sm text-green-500 dark:text-green-400 text-center bg-green-50 dark:bg-green-900/20 py-2 px-3 sm:px-4 rounded-lg'>
            Thông tin đăng nhập đã gửi đến email
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading || !isRecaptchaLoaded}
          className='w-full flex justify-center py-2.5 sm:py-3 px-4 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-primary'
        >
          {isLoading ? (
            <div className='flex items-center space-x-2'>
              <svg
                className='animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white'
                fill='none'
                viewBox='0 0 24 24'
              >
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
              <span>Đang gửi...</span>
            </div>
          ) : (
            'Quên mật khẩu'
          )}
        </button>

        <div className='text-center text-xs sm:text-sm'>
          <p className='text-gray-600 dark:text-gray-400'>
            Nhớ mật khẩu?{' '}
            <Link
              to={PATH.login}
              className='font-medium text-primary hover:text-primary/90 transition-colors duration-200'
              title='Đăng nhập'
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}

export default ForgotPassword
