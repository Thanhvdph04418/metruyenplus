import { useNavigate, useOutletContext } from 'react-router-dom'
import CustomerInfo from './CustomerInfo'
import CustomerFollowing from './CustomerFollowing'
import CustomerComments from './CustomerComments'
import PATH from '../../utils/path'

type TabType = 'info' | 'following' | 'comments' | 'logout'
type ContextType = { activeTab: TabType }

const Customer = () => {
  const { activeTab } = useOutletContext<ContextType>()
  const navigate = useNavigate()

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <CustomerInfo />
      case 'following':
        return <CustomerFollowing />
      case 'comments':
        return <CustomerComments />
      case 'logout': {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('customerInfo')
        navigate(PATH.home)
        return null
      }

      default:
        return <CustomerInfo />
    }
  }

  return renderContent()
}

export default Customer
