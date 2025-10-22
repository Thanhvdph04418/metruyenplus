import { Link, useMatch } from 'react-router-dom'
import PATH from '@/utils/path'
import { useAuth } from '@/context/AuthContext'
import { FaHome, FaHistory, FaUser, FaThList, FaTrophy } from 'react-icons/fa'

const MobileBottomTab = () => {
  const { isAuthenticated } = useAuth()
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
      to: isAuthenticated ? PATH.customerInfo : PATH.login,
      title: 'Tài khoản',
      icon: FaUser,
      isActive: isAccount
    }
  ]

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 sm:hidden'>
      <div className='flex items-center justify-around py-1.5 px-1'>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all duration-300 min-w-0 flex-1 ${
                tab.isActive
                  ? 'bg-gradient-to-r from-primary/10 to-primary-2/10 border border-primary/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={tab.title}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 transition-all duration-300 text-current flex-shrink-0 ${
                tab.isActive 
                  ? 'text-primary drop-shadow-sm scale-110' 
                  : 'hover:scale-105'
              }`} />
              <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                tab.isActive 
                  ? 'text-transparent bg-gradient-to-r from-primary to-primary-2 bg-clip-text' 
                  : ''
              }`}>{tab.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomTab
