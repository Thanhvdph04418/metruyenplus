import { Link } from 'react-router-dom'
import PATH from '@/utils/path'
import { BreadcrumbProps } from './types'

const Breadcrumb = ({ id, idChapter, dataChapter, comicIndentify }: BreadcrumbProps) => {
  return (
    <div className='hidden sm:flex items-center gap-1 my-3 dark:text-white'>
      <Link
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'instant'
          })
        }
        title='Trang chủ'
        to={PATH.home}
        className='hidden lg:flex items-center hover:text-primary text-lg'
      >
        Trang chủ{' '}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          aria-hidden='true'
          className='w-5 h-5'
          viewBox='0 0 48 48'
        >
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={3}
            d='M19 12L31 24L19 36'
          />
        </svg>
      </Link>
      <Link
        to={`${PATH.comics}/${comicIndentify}`}
        title={dataChapter.comic_name}
        className='hidden md:flex items-center text-lg hover:text-primary'
      >
        <h2 className='max-w-[200px] line-clamp-1'>
          {dataChapter.comic_name ? dataChapter.comic_name : id.split('-').join(' ')}
        </h2>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          aria-hidden='true'
          className='w-5 h-5'
          viewBox='0 0 48 48'
        >
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={3}
            d='M19 12L31 24L19 36'
          />
        </svg>
      </Link>
      <h3
        onClick={() =>
          window.scroll({
            top: 0,
            behavior: 'instant'
          })
        }
        title={dataChapter.chapters.find((item) => item.id === Number(idChapter))?.name}
        className='text-primary text-lg max-w-[150px] line-clamp-1 cursor-pointer'
      >
        {dataChapter.chapters.find((item) => item.id === Number(idChapter))?.name}
      </h3>
    </div>
  )
}

export default Breadcrumb
