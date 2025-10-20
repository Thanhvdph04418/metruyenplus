import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import comicApis from '@/apis/comicApis'
import useScrollOnReload from '@/hooks/useScrollOnReload'

interface CustomerInfoData {
  name: string
  phone?: string
  avatar?: File | string
}

const CustomerInfo = () => {
  useScrollOnReload()
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')
  const [formData, setFormData] = useState<CustomerInfoData>({
    name: customerInfo?.name || '',
    phone: customerInfo?.phone || '',
    avatar: customerInfo?.avatar || ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>(customerInfo?.avatar || '')

  const uploadAvatar = async (file: File) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await comicApis.uploadAvatar(file, token as string)
      return response
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateCustomerInfo = async (params: { name: string; phone?: string; avatar?: string }) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      const response = await comicApis.updateCustomerInfo(token as string, params)
      if (response.code !== 0) throw new Error(response.message)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ảnh đại diện phải nhỏ hơn 2MB')
        return
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error('Chỉ được phép tải lên các file JPG, JPEG, PNG & GIF')
        return
      }
      setFormData((prev) => ({ ...prev, avatar: file }))
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Show loading toast
    const loadingToast = toast.loading('Đang cập nhật thông tin...')

    try {
      let avatarUrl = formData.avatar
      if (formData.avatar instanceof File) {
        const uploadResponse = await uploadAvatar(formData.avatar)
        if (!uploadResponse) throw new Error('Không thể tải lên ảnh đại diện')
        avatarUrl = uploadResponse
      }

      const customerInfo = await updateCustomerInfo({
        name: formData.name,
        ...(formData.phone && { phone: formData.phone }),
        ...(avatarUrl && typeof avatarUrl === 'string' && { avatar: avatarUrl })
      })
      localStorage.setItem('customerInfo', JSON.stringify(customerInfo))
      toast.dismiss(loadingToast)
      toast.success('Cập nhật thông tin thành công!', {
        duration: 3000,
        position: 'top-center'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể cập nhật thông tin'
      setError(errorMessage)
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast)
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center'
      })
    }
  }

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== customerInfo?.avatar) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview, customerInfo?.avatar])

  return (
    <div className='p-4 md:p-6'>
      <form onSubmit={handleSubmit} className='space-y-4 md:space-y-8'>
        {/* Avatar Section */}
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <div className='w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 md:border-4 border-white dark:border-gray-600 shadow'>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt='Avatar preview'
                  title='Avatar preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-2xl md:text-4xl font-bold text-gray-300 dark:text-gray-500'>
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <label
              htmlFor='avatar'
              className='absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white rounded-full p-1.5 md:p-2.5 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110'
            >
              <svg
                className='w-4 h-4 md:w-5 md:h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              <input
                type='file'
                id='avatar'
                className='hidden'
                accept='image/jpeg,image/jpg,image/png,image/gif'
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className='mt-2 space-y-1 text-center'>
            <p className='text-xs md:text-sm text-gray-500 dark:text-gray-400'>
              JPG, PNG, GIF (≤ 2MB)
            </p>
            <div className='text-xs md:text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-2 md:p-3 rounded-lg'>
              <div className='flex items-start gap-1 md:gap-2'>
                <svg
                  className='w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <span className='text-left'>
                  Lưu ý: Ảnh không phù hợp có thể dẫn đến khóa tài khoản
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className='space-y-4 md:space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2'
            >
              Tên <span className='text-red-500'>*</span>
            </label>
            <input
              required
              id='name'
              type='text'
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className='w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base'
              placeholder='Nhập tên của bạn'
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2'
            >
              Số điện thoại
            </label>
            <input
              id='phone'
              type='tel'
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className='w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base'
              placeholder='Nhập số điện thoại'
              pattern='[0-9]{10}'
              title='Vui lòng nhập số điện thoại hợp lệ (10 số)'
            />
            <p className='mt-1 text-xs md:text-sm text-gray-500'>Ví dụ: 0912345678</p>
          </div>
        </div>

        {error && (
          <div className='text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 py-2 md:py-3 px-3 md:px-4 rounded-lg'>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Toaster />
        <button
          type='submit'
          disabled={isLoading}
          className='w-full flex justify-center items-center py-2.5 md:py-3 px-4 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base'
        >
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <svg className='animate-spin h-4 w-4 md:h-5 md:w-5' fill='none' viewBox='0 0 24 24'>
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
              <span>Đang cập nhật...</span>
            </div>
          ) : (
            'Cập nhật'
          )}
        </button>
      </form>
    </div>
  )
}

export default CustomerInfo
