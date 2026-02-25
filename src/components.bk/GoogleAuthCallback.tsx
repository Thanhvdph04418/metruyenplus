import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PATH from '@/utils/path'
import { syncReadingHistory } from '@/utils/history'
import comicApis from '@/apis/comicApis'

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  console.log('GoogleAuthCallback')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token and user data from URL params
        const token = searchParams.get('token')
        if (!token) {
          throw new Error('Invalid authentication response')
        }
        // Store authentication data
        localStorage.setItem('auth_token', token)
        const response = await comicApis.getCustomerInfo(token)
        localStorage.setItem('customerInfo', JSON.stringify(response))
        // Sync reading history with new token
        await syncReadingHistory(token)
        // Get redirect path from session storage
        const redirectPath = sessionStorage.getItem('auth_redirect') || PATH.home
        sessionStorage.removeItem('auth_redirect')
        // Redirect to dashboard
        navigate(redirectPath, { replace: true })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)
        setTimeout(() => navigate(PATH.login, { replace: true }), 3000)
      }
    }

    handleCallback()
  }, [navigate, searchParams])

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20'>
          <h2 className='text-xl font-semibold text-red-600 dark:text-red-400 mb-2'>
            Đăng nhập thất bại
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>{error}</p>
          <p className='text-sm mt-4'>Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto'></div>
        <p className='mt-4 text-gray-600 dark:text-gray-400'>Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}

export default GoogleAuthCallback
