import { Link, useMatch } from 'react-router-dom'
import PATH from '@/utils/path'
import { useAuth } from '@/context/AuthContext'
import { FaHome, FaHistory, FaUser, FaThList, FaTrophy } from 'react-icons/fa'

const MobileBottomTab = () => {
  const { isAuthenticated } = useAuth()

  const isHome = useMatch({ path: PATH.home, end: true })
  const isHistory = useMatch({ path: PATH.history, end: false })
  const isCustomerInfo = useMatch({ path: PATH.customerInfo, end: false })
  const isLogin = useMatch({ path: PATH.login, end: true })
  const isGenres = useMatch({ path: PATH.genres, end: false })
  const isTop = useMatch({ path: PATH.top, end: false })

  const isAccountActive = !!isCustomerInfo || (!isAuthenticated && !!isLogin)

  const tabs = [
    {
      to: PATH.home,
      title: 'Trang chủ',
      icon: FaHome,
      isActive: !!isHome
    },
    {
      to: PATH.genres,
      title: 'Thể loại',
      icon: FaThList,
      isActive: !!isGenres
    },
    {
      to: PATH.top,
      title: 'BXH',
      icon: FaTrophy,
      isActive: !!isTop
    },
    {
      to: PATH.history,
      title: 'Lịch sử',
      icon: FaHistory,
      isActive: !!isHistory
    },
    {
      to: isAuthenticated ? PATH.customerInfo : PATH.login,
      title: 'Tài khoản',
      icon: FaUser,
      isActive: isAccountActive
    }
  ]

  return (
    <nav
      className='fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-light-border dark:border-dark-highlight bg-light-surface dark:bg-dark-surface'
      aria-label='Điều hướng chính'
    >
      <div className='flex items-center justify-around gap-1 px-2 py-1.5'>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.isActive

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-2.5 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'bg-gradient-to-r from-primary/10 to-primary-2/10 border border-primary/25'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-light-highlight dark:hover:bg-dark-highlight/70 hover:text-primary'
              }`}
              title={tab.title}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive
                    ? 'text-primary drop-shadow-sm scale-110'
                    : 'text-current group-hover:scale-105'
                }`}
                aria-hidden
              />
              <span
                className={`text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                  isActive
                    ? 'text-transparent bg-gradient-to-r from-primary to-primary-2 bg-clip-text'
                    : ''
                }`}
              >
                {tab.title}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomTab
