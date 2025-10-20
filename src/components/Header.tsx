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
import {
  FaAngleDown,
  FaBookOpen,
  FaFacebookF,
  FaHistory,
  FaMars,
  FaSignOutAlt,
  FaUser,
  FaVenus
} from 'react-icons/fa'

// Internal Components
const Logo = () => (
  <Link
    to={PATH.home}
    title='MeTruyen+'
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className='flex items-center'
  >
    <span className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary-2 bg-clip-text text-transparent hover:from-primary-2 hover:to-primary transition-all duration-300'>
      MeTruyen+
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
        title='Trang chủ MeTruyen+'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        to={PATH.home}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors ${
          useMatch(PATH.home) ? 'text-primary' : ''
        }`}
      >
        Trang chủ
      </Link>
    </li>
    <li>
      <Link
        title='Tất cả thể loại truyện chữ'
        to={{
          pathname: PATH.genres,
          search: createSearchParams({ type: 'all', page: '1' }).toString()
        }}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors ${
          useMatch(PATH.genres) ? 'text-primary' : ''
        }`}
      >
        Thể loại
      </Link>
    </li>
    <li>
      <Link
        title='Truyện chữ mới nhất'
        to={{
          pathname: PATH.new,
          search: createSearchParams({ status: 'all', page: '1' }).toString()
        }}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors ${
          useMatch(PATH.new) ? 'text-primary' : ''
        }`}
      >
        Mới
      </Link>
    </li>
    <li>
      <Link
        title='Bảng xếp hạng truyện chữ'
        to={{
          pathname: PATH.top,
          search: createSearchParams({ status: 'all', page: '1' }).toString()
        }}
        className={`hover:text-primary text-lg capitalize font-medium tracking-wide px-2 py-1 rounded-lg transition-colors ${
          isMatchTop ? 'text-primary' : ''
        }`}
      >
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
  const user = JSON.parse(localStorage.getItem('customerInfo') || '{}')
  const token = localStorage.getItem('auth_token')
  const navigate = useNavigate()

  const [isShowMenuUser, setIsShowMenuUser] = useState<boolean>(false)

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  useEffect(() => {
    if (!OpenNav) {
      setIsShowMenuUser(false)
    }
  }, [OpenNav])

  return (
    <div
      className={`${
        OpenNav ? 'translate-x-0' : 'translate-x-full'
      } duration-300 transition-all dark:bg-dark-surface bg-light-bg h-full sm:hidden fixed z-50 inset-0 top-[74px] flex flex-col`}
    >
      {/* Existing content */}
      <div className='flex-1 overflow-y-auto px-4 pt-0'>
        <SearchBar />
        <ul className='flex flex-col gap-2 text-[15px] pb-5'>
          {/* Mobile Navigation Links */}
          {[
            { to: PATH.new, title: 'mới', params: { status: 'all', page: '1' } as SearchParams },
            { to: PATH.recent, title: 'Mới cập nhật', params: { page: '1' } as SearchParams },
            { to: PATH.popular, title: 'nổi bật', params: { page: '1' } as SearchParams },
            { to: PATH.completed, title: 'đã hoàn thành', params: { page: '1' } as SearchParams },
            {
              to: PATH.boy,
              title: 'con trai',
              params: { page: '1' } as SearchParams,
              icon: <FaMars />
            },
            {
              to: PATH.girl,
              title: 'con gái',
              params: { page: '1' } as SearchParams,
              icon: <FaVenus />
            }
          ].map((link) => (
            <li key={link.to}>
              {link.params ? (
                <NavLink
                  to={{
                    pathname: link.to,
                    search: createSearchParams(link.params).toString()
                  }}
                  className={({ isActive }) =>
                    `uppercase inline-flex items-center hover:text-primary text-left leading-[19px] gap-0.5 py-3 px-4 rounded-xl transition-colors ${
                      isActive && 'text-primary bg-primary/10'
                    }`
                  }
                >
                  {link.title}
                  {link?.icon}
                </NavLink>
              ) : (
                <Link
                  to={link.to}
                  className={`hover:text-primary text-left inline-flex items-center uppercase leading-[19px] gap-0.5 py-3 px-4 rounded-xl transition-colors ${
                    useMatch(link.to) && 'text-primary bg-primary/10'
                  }`}
                  title={link.title}
                >
                  {link.title}
                  {link?.icon}
                </Link>
              )}
            </li>
          ))}
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
  }, [pathname, queryConfig.q])

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
    if (OpenNav) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [OpenNav])

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
            title='Lịch sử truyện chữ'
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
            title='Tìm kiếm truyện chữ'
            onClick={() => setOpenNav((prev) => !prev)}
            className='bg-center bg-no-repeat w-[18px] h-[18px] p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            style={{ backgroundImage: `url(${iconSearch})` }}
          />
          <button
            style={{position:'absolute', right:10}}
            title='Menu truyện chữ MeTruyen+'
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
      </div>
    </div>
  )
}

export default Header
