import { PATH } from '@/utils/path'
import { Link } from 'react-router-dom'
import { SITE_NAME, SITE_BRAND_EMAIL } from '@/config/siteConfig'

const Footer = () => {
  return (
    <footer className='border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'>
      <div className='container max-w-[1100px] px-4 py-4'>
        <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400'>
          <Link to={PATH.home} className='font-semibold text-neutral-900 dark:text-white hover:text-primary'>
            {SITE_NAME}
          </Link>
          <Link to={PATH.privatePolicy} className='hover:text-primary'>
            Chính sách
          </Link>
          <Link to={PATH.app} className='hover:text-primary'>
            Ứng dụng
          </Link>
          <a href={`mailto:${SITE_BRAND_EMAIL}`} className='hover:text-primary'>
            Liên hệ
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
