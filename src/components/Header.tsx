import {
  Link,
  NavLink,
  createSearchParams,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom'
import PATH from '@/utils/path'
import { useEffect, useMemo, useState } from 'react'
import iconSearch from '/icon_search.webp'
import classNames from 'classnames'
import { SearchBar } from '.'
import { useQueryConfig } from '@/hooks'
import { useAuth } from '@/context/AuthContext'
import { SvgMoon, SvgSun } from './Icons'
import comicApis from '@/apis/comicApis'
import {
  FaFacebookF,
  FaMars,
  FaVenus,
  FaHome,
  FaMobileAlt,
  FaThList,
  FaStar,
  FaTrophy,
  FaClock,
  FaFire,
  FaCheckCircle
} from 'react-icons/fa'

// Internal Components
const Logo = () => (
  <Link
    to={PATH.home}
    title='Tcomic'
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className='flex items-center'
  >
    <span className='text-2xl lg:text-3xl logo-text-bold gradient-logo-text hover:from-primary-2 hover:to-primary transition-all duration-300'>
      Tcomic
    </span>
  </Link>
)

type SearchParams = {
  type?: string
  status?: string
  page: string
}

const DesktopNavLinks = ({ isMatchTop }: { isMatchTop: boolean }) => (
  <ul className='hidden sm:flex items-center gap-5 ml-6 mt-1'>
    <li className='hidden lg:block'>
      <Link
        title='Trang chủ Tcomic'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        to={PATH.home}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors flex items-center gap-2 ${
          useMatch(PATH.home) ? 'text-primary' : ''
        }`}
      >
        <FaHome className='w-4 h-4 text-current' />
        Trang chủ
      </Link>
    </li>
    <li>
      <Link
        title='Ứng dụng'
        to={{
          pathname: PATH.app
        }}
        className={`hover:text-primary text-lg capitalize flex items-center gap-2 ${useMatch(PATH.app) && 'text-primary'}`}
      >
        <FaMobileAlt className='w-4 h-4 text-current' />
        Ứng dụng
      </Link>
    </li>
    <li>
      <Link
        title='Tất cả thể loại truyện tranh'
        to={{
          pathname: PATH.genres,
          search: createSearchParams({ type: 'all', page: '1' }).toString()
        }}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors flex items-center gap-2 ${
          useMatch(PATH.genres) ? 'text-primary' : ''
        }`}
      >
        <FaThList className='w-4 h-4 text-current' />
        Thể loại
      </Link>
    </li>
    <li>
      <Link
        title='Truyện tranh mới nhất'
        to={{
          pathname: PATH.new,
          search: createSearchParams({ status: 'all', page: '1' }).toString()
        }}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors flex items-center gap-2 ${
          useMatch(PATH.new) ? 'text-primary' : ''
        }`}
      >
        <FaStar className='w-4 h-4 text-current' />
        Mới
      </Link>
    </li>
    <li>
      <Link
        title='Bảng xếp hạng truyện tranh'
        to={{
          pathname: PATH.top,
          search: createSearchParams({ status: 'all', page: '1' }).toString()
        }}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors flex items-center gap-2 ${
          isMatchTop ? 'text-primary' : ''
        }`}
      >
        <FaTrophy className='w-4 h-4 text-current' />
        BXH
      </Link>
    </li>
  </ul>
)

const ThemeToggle = ({
  OpenTheme,
  setOpenTheme,
  handleChangeTheme
}: {
  OpenTheme: boolean
  setOpenTheme: (value: boolean) => void
  handleChangeTheme: (type: 'light' | 'dark') => void
}) => (
  <div
    onMouseEnter={() => setOpenTheme(true)}
    onMouseLeave={() => setOpenTheme(false)}
    className='relative flex flex-col items-center px-2 py-1 hover:text-primary cursor-pointer'
  >
    {/* Theme Icon */}
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
      />
    </svg>
    <span className='capitalize text-xs mt-[2px]'>giao diện</span>

    {/* Theme Dropdown - Positioned with transform to prevent layout shifts */}
    <div
      className={`absolute top-10 bg-transparent py-2 z-50 transition-all duration-200 ${
        OpenTheme ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className='p-1 lg:p-2 border dark:border-gray-400 shadow-lg rounded-md flex flex-col justify-center items-center bg-light-surface text-black dark:bg-dark-surface dark:text-white min-w-[120px]'>
        {/* Light Theme Button */}
        <button
          title='Nền sáng'
          onClick={() => {
            setOpenTheme(false)
            handleChangeTheme('light')
          }}
          className='active:scale-90 hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] rounded-md py-1 px-2 flex items-center justify-start gap-2 min-w-[80px] w-full'
        >
          {/* Light Theme Icon */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 flex-shrink-0'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
            />
          </svg>
          <span className='flex-1 text-left'>Sáng</span>
        </button>
        <span className='h-[1px] w-[80%] border-b border-dashed my-1' />
        {/* Dark Theme Button */}
        <button
          title='Nền tối'
          onClick={() => {
            setOpenTheme(false)
            handleChangeTheme('dark')
          }}
          className='active:scale-90 hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] rounded-md py-1 px-2 flex items-center justify-start gap-2 min-w-[80px] w-full'
        >
          {/* Dark Theme Icon */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 flex-shrink-0'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
            />
          </svg>
          <span className='flex-1 text-left'>Tối</span>
        </button>
      </div>
    </div>
  </div>
)

const MobileNavigation = ({
  OpenNav,
  setOpenNav,
  handleChangeTheme
}: {
  OpenNav: boolean
  setOpenNav: (value: boolean) => void
  handleChangeTheme: (type: 'light' | 'dark') => void
}) => {
  const { logout } = useAuth()
  const token = localStorage.getItem('auth_token')

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }


  return (
    <div
      className={`${
        OpenNav ? 'translate-x-0' : 'translate-x-full'
      } duration-300 transition-all dark:bg-dark-surface bg-light-bg h-full sm:hidden fixed z-50 inset-0 top-[74px] flex flex-col`}
    >
      {/* Existing content */}
      <div className='flex-1 overflow-y-auto px-4 pt-0'>
        <SearchBar />
        <ul className='flex flex-col gap-1 text-[15px] pb-5'>
          {/* Group 1: Main Navigation */}
          <div className='mb-3'>
            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4'>
              Điều hướng
            </h3>
            {[
              { to: PATH.app, title: 'Ứng dụng', icon: <FaMobileAlt className='w-4 h-4' />},
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`hover:text-primary text-left inline-flex items-center uppercase leading-[19px] gap-3 py-3 px-4 rounded-xl transition-colors ${
                    useMatch(link.to) && 'text-primary bg-primary/10'
                  }`}
                  title={link.title}
                >
                  {link?.icon}
                  {link.title}
                </Link>
              </li>
            ))}
          </div>

          {/* Group 2: Comic Categories */}
          <div className='mb-3'>
            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4'>
              Thể loại truyện
            </h3>
            {[
              { to: PATH.new, title: 'Mới', params: { status: 'all', page: '1' } as SearchParams, icon: <FaStar className='w-4 h-4' /> },
              { to: PATH.recent, title: 'Mới cập nhật', params: { page: '1' } as SearchParams, icon: <FaClock className='w-4 h-4' /> },
              { to: PATH.popular, title: 'Nổi bật', params: { page: '1' } as SearchParams, icon: <FaFire className='w-4 h-4' /> },
              { to: PATH.completed, title: 'Đã hoàn thành', params: { page: '1' } as SearchParams, icon: <FaCheckCircle className='w-4 h-4' /> },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={{
                    pathname: link.to,
                    search: createSearchParams(link.params).toString()
                  }}
                  className={({ isActive }) =>
                    `uppercase inline-flex items-center hover:text-primary text-left leading-[19px] gap-3 py-3 px-4 rounded-xl transition-colors ${
                      isActive && 'text-primary bg-primary/10'
                    }`
                  }
                >
                  {link?.icon}
                  {link.title}
                </NavLink>
              </li>
            ))}
          </div>

          {/* Group 3: Gender Categories */}
          <div className='mb-3'>
            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4'>
              Phân loại
            </h3>
            {[
              {
                to: PATH.boy,
                title: 'Con trai',
                params: { page: '1' } as SearchParams,
                icon: <FaMars className='w-4 h-4' />
              },
              {
                to: PATH.girl,
                title: 'Con gái',
                params: { page: '1' } as SearchParams,
                icon: <FaVenus className='w-4 h-4' />
              }
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={{
                    pathname: link.to,
                    search: createSearchParams(link.params).toString()
                  }}
                  className={({ isActive }) =>
                    `uppercase inline-flex items-center hover:text-primary text-left leading-[19px] gap-3 py-3 px-4 rounded-xl transition-colors ${
                      isActive && 'text-primary bg-primary/10'
                    }`
                  }
                >
                  {link?.icon}
                  {link.title}
                </NavLink>
              </li>
            ))}
          </div>

          {/* Group 4: Social */}
          <div className='mb-3'>
            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4'>
              Cộng đồng
            </h3>
            <li>
              <Link
                to='https://www.facebook.com/groups/523416513198612'
                className='hover:text-primary text-left inline-flex items-center uppercase leading-[19px] gap-3 py-3 px-4 rounded-xl transition-colors'
                title='Facebook'
              >
                <FaFacebookF className='w-4 h-4' />
                Group
              </Link>
            </li>
          </div>
        </ul>
      </div>

      {/* Modified footer section */}
      <div className='sticky bottom-0 left-0 right-0 bg-light-highlight dark:bg-gray-800 border-t border-light-border dark:border-gray-700 py-4 hidden'>
        <div className='flex items-center justify-center gap-8'>
          <Link
            to={PATH.history}
            className='flex flex-col items-center px-3 py-1 rounded-md hover:text-primary'
            title='Lịch sử đọc truyện'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='capitalize text-xs mt-1'>lịch sử</span>
          </Link>

          {/* Theme Toggle */}
          {localStorage.theme !== 'light' ? (
            <button
              onClick={() => {
                handleChangeTheme('light')
                setOpenNav(false)
              }}
              className='active:scale-90 rounded-md py-1 px-3 flex flex-col items-center'
            >
              <SvgSun />
              <span className='capitalize text-xs mt-1'>sáng</span>
            </button>
          ) : (
            <button
              onClick={() => {
                handleChangeTheme('dark')
                setOpenNav(false)
              }}
              className='active:scale-90 rounded-md py-1 px-3 flex flex-col items-center'
            >
              <SvgMoon />
              <span className='capitalize text-xs mt-1'>tối</span>
            </button>
          )}

          {/* Account Settings/Logout - New Addition */}
          {token && (
            <div className='flex flex-col items-center'>
              <button
                onClick={handleLogout}
                className='flex flex-col items-center px-3 py-1 rounded-md hover:text-red-500'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
                  />
                </svg>
                <span className='capitalize text-xs mt-1'>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add new UserInfo component
const UserInfoDesktop = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('customerInfo') || '{}')

  // Add timeout to prevent quick hover closing
  let timeoutId: NodeJS.Timeout

  const handleMouseEnter = () => {
    clearTimeout(timeoutId)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false)
    }, 300) // 300ms delay before closing
  }

  const handleLogout = async () => {
    await logout()
    navigate(PATH.home)
  }

  const handleUserInfoClick = () => {
    window.location.href = PATH.customerInfo
  }

  const defaultAvatar = user?.name ? (
    <div
      className='w-full h-full rounded-full flex items-center justify-center text-white font-medium'
      style={{ backgroundColor: user.colorProfile || '#4B5563' }}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>
  ) : (
    <div className='w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
        />
      </svg>
    </div>
  )

  return (
    <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        onClick={handleUserInfoClick}
            className='flex items-center gap-2 px-2 py-1 hover:bg-light-highlight dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors duration-200 focus:outline-none'
      >
        <div className='w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0'>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || user.username}
              width={32}
              height={32}
              className='w-full h-full object-cover'
              title={user.name || user.username}
              loading='lazy'
            />
          ) : (
            defaultAvatar
          )}
        </div>
        <span className='text-sm font-medium'>{user?.name || user?.username || 'Tài khoản'}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </div>

      <div
        className={`absolute top-12 right-0 bg-light-card dark:bg-gray-900 border border-light-border dark:border-gray-700 shadow-lg rounded-xl py-2 z-50 min-w-[200px] divide-y divide-light-border dark:divide-gray-700 transition-all duration-200 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='px-4 py-2'>
          <div className='font-medium text-sm'>{user?.name || user?.username}</div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>{user?.email}</div>
          {user?.isVip && (
            <div className='mt-1 inline-flex items-center gap-1 text-xs bg-gradient text-white px-2 py-0.5 rounded-full'>
              <span className='w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse'></span>
              VIP{' '}
              {user.vipExpiredAt &&
                `- Hết hạn: ${new Date(user.vipExpiredAt).toLocaleDateString()}`}
            </div>
          )}
        </div>
        <div className='py-1'>
          <Link
            to={PATH.customerInfo}
            className='px-4 py-2 text-sm hover:bg-light-highlight dark:hover:bg-gray-800 flex items-center gap-2 transition-colors duration-200'
            title='Thông tin tài khoản'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            Thông tin tài khoản
          </Link>
          <Link
            to={PATH.customerInfo + '?tab=following'}
            className='px-4 py-2 text-sm hover:bg-light-highlight dark:hover:bg-gray-800 flex items-center gap-2 transition-colors duration-200'
            title='Truyện theo dõi'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
              />
            </svg>
            Truyện theo dõi
          </Link>
          <button
            onClick={handleLogout}
            className='px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left flex items-center gap-2 transition-colors duration-200'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  )
}

// Mobile Search Overlay Component
const MobileSearchOverlay = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  searchSuggestions,
  isSearching,
  onSuggestionClick,
  recentSearches,
  onRecentSearchClick,
  onRemoveRecentSearch,
  onClearRecentSearches
}: {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchSubmit: (e: React.FormEvent) => void
  searchSuggestions: any[]
  isSearching: boolean
  onSuggestionClick: (suggestion: any) => void
  recentSearches: string[]
  onRecentSearchClick: (query: string) => void
  onRemoveRecentSearch: (query: string) => void
  onClearRecentSearches: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 bg-white dark:bg-gray-900 sm:hidden flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
        <button
          onClick={onClose}
          className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Tìm kiếm truyện</h2>
        <div className='w-10' /> {/* Spacer for centering */}
      </div>

      {/* Search Form */}
      <div className='p-4 flex-shrink-0'>
        <form onSubmit={onSearchSubmit} className='relative'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={onSearchChange}
              placeholder='Nhập tên truyện, tác giả...'
              autoFocus
              className='w-full px-4 py-3 pl-12 pr-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            {searchQuery && (
              <button
                type='button'
                onClick={() => onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600'
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Container - Full Height */}
      <div className='flex-1 overflow-y-auto px-4 pb-4'>

        {/* Search Suggestions */}
        {searchQuery.trim().length > 0 ? (
          <div className='mt-4'>
            <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
              Gợi ý tìm kiếm
            </h3>
            {isSearching ? (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                <span className='ml-2 text-gray-500 dark:text-gray-400'>Đang tìm kiếm...</span>
              </div>
            ) : searchSuggestions.length > 0 ? (
              <div className='space-y-2'>
                {searchSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => onSuggestionClick(suggestion)}
                    className='w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center gap-3'
                  >
                    {/* Thumbnail */}
                    <div className='flex-shrink-0 w-12 h-16 rounded-md overflow-hidden'>
                      <img
                        src={suggestion.thumbnail}
                        alt={suggestion.title}
                        className='w-full h-full object-cover'
                        loading='lazy'
                      />
                    </div>
                    
                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-sm truncate'>{suggestion.title}</div>
                      <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>{suggestion.authors}</div>
                      <div className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                        {suggestion.total_views} lượt xem
                      </div>
                    </div>
                    
                    {/* Arrow icon */}
                    <svg className='w-4 h-4 text-gray-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                <svg className='w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <p>Không tìm thấy gợi ý nào</p>
                <p className='text-xs mt-2'>Thử từ khóa khác hoặc kiểm tra kết nối mạng</p>
              </div>
            )}
          </div>
        ) : (
          /* Recent Searches */
          recentSearches.length > 0 && (
            <div className='mt-6'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Tìm kiếm gần đây</h3>
                <button
                  onClick={onClearRecentSearches}
                  className='text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors'
                >
                  Xóa tất cả
                </button>
              </div>
              <div className='space-y-2'>
                {recentSearches.map((recent) => (
                  <div
                    key={recent}
                    className='flex items-center gap-2 group'
                  >
                    <button
                      onClick={() => onRecentSearchClick(recent)}
                      className='flex-1 text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      {recent}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveRecentSearch(recent)
                      }}
                      className='p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
                      title='Xóa'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

// Add new LoginButton component
const LoginButtonDesktop = () => (
  <Link
    to={PATH.login}
    className='group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-primary transition duration-300 ease-out border-2 border-primary rounded-xl shadow-md focus:outline-none'
  >
    <span className='absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-primary group-hover:translate-x-0 ease'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
        />
      </svg>
    </span>
    <span className='absolute flex items-center justify-center w-full h-full text-primary transition-all duration-300 transform group-hover:translate-x-full ease'>
      Đăng nhập
    </span>
    <span className='relative invisible'>Đăng nhập</span>
  </Link>
)

const Header = () => {
  const queryConfig = useQueryConfig()
  const { pathname } = useLocation()
  const isMatchTop = useMemo(() => pathname.includes('/top'), [pathname])
  const [OpenTheme, setOpenTheme] = useState<boolean>(false)
  const [OpenNav, setOpenNav] = useState<boolean>(false)
  const [currentTheme, setCurrentTheme] = useState<string>(localStorage.getItem('theme') || 'light')
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const token = localStorage.getItem('auth_token')

  const heightHeader = 75

  const onSwitchTheme = (theme: 'light' | 'dark') => {
    handleChangeTheme(theme)
    if (OpenNav) {
      setOpenNav(false)
    }
  }

  // Sync theme state with localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark'
    setCurrentTheme(storedTheme)
  }, [])

  useEffect(() => {
    document.body.style.overflow = OpenNav ? 'hidden' : 'unset'
  }, [OpenNav])

  useEffect(() => {
    setOpenNav(false)
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [pathname, queryConfig.q])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error parsing recent searches:', error)
        setRecentSearches([])
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    
    const newSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(newSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newSearches))
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      const searchUrl = `/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}&page=1`
      window.location.href = searchUrl
    }
  }

  // Handle search input change with API search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim().length > 0) {
      setIsSearching(true)
      // API call with debounce
      const timeoutId = setTimeout(async () => {
        try {
          const response = await comicApis.getSearch({ q: value, page: '1' })
          console.log('Search response:', response.data) // Debug log
          
          // Check if response is valid and has comics
          if (response?.data?.status === 0 && response?.data?.comics && Array.isArray(response.data.comics)) {
            const comics = response.data.comics || []
            console.log('Comics found:', comics) // Debug log
            setSearchSuggestions(comics.slice(0, 5)) // Limit to 5 suggestions
          } else {
            console.log('API error or no comics:', response?.data)
            setSearchSuggestions([])
          }
        } catch (error) {
          console.error('Search suggestions error:', error)
          // Don't show error to user, just clear suggestions
          setSearchSuggestions([])
        } finally {
          setIsSearching(false)
        }
      }, 300) // 300ms debounce
      
      return () => clearTimeout(timeoutId)
    } else {
      setSearchSuggestions([])
      setIsSearching(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    saveRecentSearch(suggestion.title)
    window.location.href = `/truyen-tranh/${suggestion.slug}-${suggestion.id}`
  }

  // Handle recent search click
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query)
    saveRecentSearch(query)
    const searchUrl = `/tim-kiem?q=${encodeURIComponent(query)}&page=1`
    window.location.href = searchUrl
  }

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Remove single recent search
  const removeRecentSearch = (queryToRemove: string) => {
    const newSearches = recentSearches.filter(query => query !== queryToRemove)
    setRecentSearches(newSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newSearches))
  }

  // Close search when clicking outside
  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchSuggestions([])
    setIsSearching(false)
  }

  const handleChangeTheme = (type: 'light' | 'dark') => {
    // Add transition class for smoother theme change
    document.documentElement.classList.add('transition')

    if (type === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.body.classList.remove('dark:bg-gray-900')
      localStorage.setItem('theme', 'light')
      setCurrentTheme('light')
    }
    if (type === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark:bg-gray-900')
      localStorage.setItem('theme', 'dark')
      setCurrentTheme('dark')
    }

    // Remove transition class after the transition completes
    setTimeout(() => {
      document.documentElement.classList.remove('transition')
    }, 800)
  }

  useEffect(() => {
    const elementHeader = document.getElementById('site-header')

    const handleScroll = () => {
      if (!elementHeader) return
      if (window.scrollY > heightHeader) {
        elementHeader.classList.add('is-hide-header')
      } else {
        elementHeader.classList.remove('is-hide-header')
      }
      return () => {
        // optional: dọn dẹp khi unmount
        elementHeader.classList.remove('is-hide-header')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (OpenNav || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [OpenNav, isSearchOpen])

  return (
    <div className='bg-light-surface text-[#333744] dark:bg-dark-bg dark:text-[#e3e5ef] shadow dark:border-b dark:border-dark-highlight'>
      <div className='container px-4 xl:px-0 h-[74px] flex items-center justify-between'>
        {/* Left Section */}
        <div className='flex items-center'>
          <Logo />
          <DesktopNavLinks isMatchTop={isMatchTop} />
        </div>

        {/* Desktop Right Section - Fixed height to prevent layout shifts */}
        <div className='hidden sm:flex items-center h-[44px]'>
          <div className='min-w-[120px]'>
            {token ? <UserInfoDesktop /> : <LoginButtonDesktop />}
          </div>
          <Link
            title='Lịch sử truyện tranh'
            to={PATH.history}
            className='flex flex-col items-center px-2 py-1 rounded-md hover:text-primary min-w-[60px] focus:outline-none'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='capitalize text-xs mt-[2px]'>lịch sử</span>
          </Link>
          <div className='min-w-[60px]'>
            <ThemeToggle
              OpenTheme={OpenTheme}
              setOpenTheme={setOpenTheme}
              handleChangeTheme={handleChangeTheme}
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className='flex sm:hidden items-center gap-1'>
          <div style={{
            display:'flex',
            alignItems:'center',
            gap:10,
            position:'absolute',
            right:70
          }}>
          {currentTheme !== 'light' ? (
            <button onClick={() => onSwitchTheme('light')} className='mr-1 p-1'>
              <SvgSun />
            </button>
          ) : (
            <button onClick={() => onSwitchTheme('dark')} className='mr-1 p-1'>
              <SvgMoon />
            </button>
          )}
          <button
            title='Tìm kiếm truyện tranh'
            onClick={() => setIsSearchOpen(true)}
            className='bg-center bg-no-repeat w-[18px] h-[18px] p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            style={{ backgroundImage: `url(${iconSearch})` }}
          />
          </div>
          <button
            style={{position:'absolute', right:10}}
            title='Menu truyện tranh Tcomic'
            onClick={() => setOpenNav((prev) => !prev)}
            className='flex flex-col gap-[5px] p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
          >
            <span
              className={classNames(
                'block w-6 h-[3px] rounded-full bg-gray-400 transition-all duration-300',
                {
                  'rotate-45 translate-y-2': OpenNav,
                  'rotate-0': !OpenNav
                }
              )}
            />
            <span
              className={classNames(
                'block w-6 h-[3px] rounded-full bg-gray-400 transition-all duration-300',
                {
                  'opacity-0': OpenNav,
                  'opacity-100': !OpenNav
                }
              )}
            />
            <span
              className={classNames(
                'block w-6 h-[3px] rounded-full bg-gray-400 transition-all duration-300',
                {
                  '-rotate-45 -translate-y-2': OpenNav,
                  'rotate-0': !OpenNav
                }
              )}
            />
          </button>
        </div>

        {/* Mobile Navigation Menu - Only visible on mobile */}
        <div className='sm:hidden'>
          <MobileNavigation
            OpenNav={OpenNav}
            setOpenNav={setOpenNav}
            handleChangeTheme={handleChangeTheme}
          />
        </div>

        {/* Mobile Search Overlay */}
        <MobileSearchOverlay
          isOpen={isSearchOpen}
          onClose={handleSearchClose}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          searchSuggestions={searchSuggestions}
          isSearching={isSearching}
          onSuggestionClick={handleSuggestionClick}
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onRemoveRecentSearch={removeRecentSearch}
          onClearRecentSearches={clearRecentSearches}
        />
      </div>
    </div>
  )
}

export default Header
