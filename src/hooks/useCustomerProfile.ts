import { useState, useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import comicApis from '@/apis/comicApis'
import { validateFile, createFilePreviewUrl, revokeFilePreviewUrl } from '@/utils/validators'

export interface CustomerProfileData {
  name: string
  phone?: string
  avatar?: File | string | null
}

export interface UseCustomerProfileOptions {
  onSuccess?: () => void
}

/**
 * Hook for customer profile management
 * Handles form state, avatar upload, and profile updates
 * @param initialData - Initial form data (optional)
 * @param options - Hook options
 * @returns Profile management functions and state
 */
export const useCustomerProfile = (
  initialData?: Partial<CustomerProfileData>,
  options?: UseCustomerProfileOptions
) => {
  const queryClient = useQueryClient()
  
  // Get initial data from localStorage if not provided
  const getInitialData = useCallback(() => {
    if (initialData) return initialData
    try {
      const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')
      return {
        name: customerInfo?.name || '',
        phone: customerInfo?.phone || '',
        avatar: customerInfo?.avatar || null,
      }
    } catch {
      return {
        name: '',
        phone: '',
        avatar: null,
      }
    }
  }, [initialData])

  const [formData, setFormData] = useState<CustomerProfileData>(() => getInitialData())
  const [avatarPreview, setAvatarPreview] = useState<string | null>(() => {
    const data = getInitialData()
    return typeof data.avatar === 'string' ? data.avatar : null
  })

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation(
    (file: File) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      return comicApis.uploadAvatar(file, token)
    },
    {
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể tải avatar lên. Vui lòng thử lại.'
        toast.error(message)
      },
    }
  )

  // Profile update mutation
  const updateProfileMutation = useMutation(
    (data: { name: string; phone?: string; avatar?: string }) => {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('Unauthorized')
      return comicApis.updateCustomerInfo(token, data)
    },
    {
      onSuccess: (response) => {
        if (response.code !== 0) {
          throw new Error(response.message)
        }
        
        queryClient.invalidateQueries(['customer', 'profile'])
        
        // Update localStorage
        const updatedInfo = {
          name: response.data.name,
          phone: response.data.phone,
          avatar: response.data.avatar,
        }
        localStorage.setItem('customerInfo', JSON.stringify(updatedInfo))
        
        toast.success('Đã cập nhật thông tin')
        options?.onSuccess?.()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.'
        toast.error(message)
      },
    }
  )

  // Handle avatar change
  const handleAvatarChange = useCallback((file: File | null) => {
    // Clean up previous preview if it was an object URL
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      revokeFilePreviewUrl(avatarPreview)
    }

    if (!file) {
      setFormData((prev) => ({ ...prev, avatar: null }))
      setAvatarPreview(null)
      return
    }

    // Validate file (2MB max, image types only)
    const validation = validateFile(file, {
      maxSizeMB: 2,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    })
    
    if (!validation.valid) {
      toast.error(validation.error?.message || 'File không hợp lệ')
      return
    }

    // Create preview
    const previewUrl = createFilePreviewUrl(file)
    setFormData((prev) => ({ ...prev, avatar: file }))
    setAvatarPreview(previewUrl)
  }, [avatarPreview])

  // Handle form field change
  const handleFieldChange = useCallback((field: keyof CustomerProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Handle form submit
  const handleSubmit = useCallback(async () => {
    const loadingToast = toast.loading('Đang cập nhật thông tin...')
    
    try {
      let avatarUrl: string | undefined

      // Upload avatar if changed (it's a File object)
      if (formData.avatar instanceof File) {
        const uploadResponse = await uploadAvatarMutation.mutateAsync(formData.avatar)
        if (!uploadResponse) throw new Error('Không thể tải lên ảnh đại diện')
        avatarUrl = uploadResponse
      } else if (typeof formData.avatar === 'string') {
        // Avatar is already a URL string
        avatarUrl = formData.avatar
      }

      // Update profile
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        ...(formData.phone && { phone: formData.phone }),
        ...(avatarUrl && { avatar: avatarUrl }),
      })

      // Update preview to use the new URL
      if (avatarUrl) {
        // Clean up old preview if it was an object URL
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
          revokeFilePreviewUrl(avatarPreview)
        }
        setAvatarPreview(avatarUrl)
      }

      toast.dismiss(loadingToast)
    } catch (error) {
      toast.dismiss(loadingToast)
      throw error
    }
  }, [formData, uploadAvatarMutation, updateProfileMutation, avatarPreview])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        revokeFilePreviewUrl(avatarPreview)
      }
    }
  }, [avatarPreview])

  return {
    formData,
    avatarPreview,
    handleAvatarChange,
    handleFieldChange,
    handleSubmit,
    isUploading: uploadAvatarMutation.isLoading,
    isUpdating: updateProfileMutation.isLoading,
    isLoading: uploadAvatarMutation.isLoading || updateProfileMutation.isLoading,
  }
}
