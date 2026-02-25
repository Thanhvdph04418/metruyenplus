import useScrollOnReload from '@/hooks/useScrollOnReload'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import CustomerInfoForm from './CustomerInfoForm'

const CustomerInfo = () => {
  useScrollOnReload()

  // Use the hook for all business logic
  const {
    formData,
    avatarPreview,
    handleAvatarChange,
    handleFieldChange,
    handleSubmit,
    isLoading
  } = useCustomerProfile()

  return (
    <div className='p-4 md:p-6'>
      <CustomerInfoForm
        name={formData.name}
        phone={formData.phone}
        avatarPreview={avatarPreview}
        onNameChange={(value) => handleFieldChange('name', value)}
        onPhoneChange={(value) => handleFieldChange('phone', value)}
        onAvatarChange={(e) => {
          const file = e.target.files?.[0]
          handleAvatarChange(file || null)
        }}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        isLoading={isLoading}
      />
    </div>
  )
}

export default CustomerInfo
