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
    <div className='max-w-2xl mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Avatar Section */}
        <div className='flex flex-col items-center'>
          <div className='relative group'>
            <div className='w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-4 border-white dark:border-gray-600 shadow-2xl ring-4 ring-primary/20'>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt='Avatar preview'
                  title='Avatar preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-4xl md:text-5xl font-bold text-gray-400 dark:text-gray-500'>
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <label
              htmlFor='avatar'
              className='absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-full p-3 cursor-pointer shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group-hover:scale-105'
            >
              <svg
                className='w-5 h-5'
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
          <div className='mt-6 space-y-3 text-center'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Ảnh đại diện
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              JPG, PNG, GIF (≤ 2MB)
            </p>
            <div className='inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800'>
              <svg
                className='w-4 h-4 flex-shrink-0'
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
              <span>
                Lưu ý: Ảnh không phù hợp có thể dẫn đến khóa tài khoản
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className='space-y-6'>
          <div className='bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6'>
            <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
              <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
              Thông tin cơ bản
            </h4>
            <div className='space-y-5'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Tên <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    required
                    id='name'
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base transition-all duration-200'
                    placeholder='Nhập tên của bạn'
                    minLength={2}
                    maxLength={50}
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Số điện thoại
                </label>
                <div className='relative'>
                  <input
                    id='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base transition-all duration-200'
                    placeholder='Nhập số điện thoại'
                    pattern='[0-9]{10}'
                    title='Vui lòng nhập số điện thoại hợp lệ (10 số)'
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </div>
                </div>
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>Ví dụ: 0912345678</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className='flex items-center gap-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-xl border border-red-200 dark:border-red-800'>
            <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <Toaster />
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            type='button'
            onClick={() => window.history.back()}
            className='flex-1 sm:flex-none px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-200'
          >
            Hủy
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='flex-1 sm:flex-none flex justify-center items-center px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
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
              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                </svg>
                <span>Cập nhật thông tin</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CustomerInfo
