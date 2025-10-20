import { Link, useLocation, useMatch } from 'react-router-dom'
import PATH from '@/utils/path'
import { useAuth } from '@/context/AuthContext'
import { FaHome, FaHistory, FaUser, FaThList, FaTrophy } from 'react-icons/fa'

const MobileBottomTab = () => {
  const { pathname } = useLocation()
  const { token } = useAuth()
  const isHome = useMatch(PATH.home)
  const isHistory = useMatch(PATH.history)
  const isAccount = useMatch(PATH.customerInfo)
  const isGenres = useMatch(PATH.genres)
  const isTop = useMatch(PATH.top)

  const tabs = [
    {
      to: PATH.home,
      title: 'Trang chủ',
      icon: FaHome,
      isActive: isHome
    },
    {
      to: PATH.genres,
      title: 'Thể loại',
      icon: FaThList,
      isActive: isGenres
    },
    {
      to: PATH.top,
      title: 'BXH',
      icon: FaTrophy,
      isActive: isTop
    },
    {
      to: PATH.history,
      title: 'Lịch sử',
      icon: FaHistory,
      isActive: isHistory
    },
    {
      to: token ? PATH.customerInfo : PATH.login,
      title: 'Tài khoản',
      icon: FaUser,
      isActive: isAccount
    }
  ]

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 sm:hidden'>
      <div className='flex items-center justify-around py-2'>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                tab.isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
              title={tab.title}
            >
              <Icon className='w-5 h-5 mb-1' />
              <span className='text-xs font-medium'>{tab.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomTab
