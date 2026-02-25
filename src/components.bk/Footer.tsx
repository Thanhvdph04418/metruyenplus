import { PATH } from '@/utils/path'
import { Link } from 'react-router-dom'
import { convertToSlug } from '@/utils/slugify'

const Footer = () => {
  return (
    <footer className='bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 mt-20 border-t border-gray-200 dark:border-gray-800'>
      <div className='container py-6 px-4'>
        {/* Keywords Section */}
        <div className='mb-6'>
          <h2 className='text-primary dark:text-primary-2 text-sm font-semibold mb-3'>
            Từ khóa nổi bật:
          </h2>
          <div className='flex flex-wrap gap-2 text-xs'>
            {[
              'Truyen tranh',
              'Truyen tranh online',
              'truyen tranh hay',
              'truyenqqto',
              'nettruyen',
              'cmanga',
              'saytruyen',
              'blogtruyen',
              'vlogtruyen',
              'comanhua',
              'nhattruyenmin',
              'nettruyen ngôn tình'
            ].map((keyword) => (
              <a
                key={keyword}
                href={`${PATH.search}?q=${keyword}`}
                className='hover:text-primary dark:hover:text-primary-2 transition-colors duration-200'
                title={`Tìm kiếm ${keyword}`}
              >
                {keyword}
              </a>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className='mb-8'>
          <h2 className='text-primary-2 dark:text-secondary text-sm font-semibold mb-3'>
            Thể loại
          </h2>
          <div className='flex flex-wrap gap-2'>
            {[
              'Action',
              'Adult',
              'Chuyển Sinh',
              'Đam Mỹ',
              'Ecchi',
              'Harem',
              'Manhua',
              'Manhwa',
              'Manga',
              'Ngôn Tình',
              'Xuyên Không'
            ].map((category) => (
              <a
                key={category}
                href={`${PATH.genres}?page=1&type=${convertToSlug(category)}`}
                className='px-3 py-0.5 text-xs border border-gray-300 dark:border-gray-700 rounded-xl 
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200
                         focus:outline-none'
                title={`Xem thể loại ${category}`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Introduction */}
          <div>
            <h2 className='text-gray-900 dark:text-white text-xs font-semibold border-b border-primary pb-1.5 mb-3'>
              GIỚI THIỆU
            </h2>
            <p className='text-xs leading-relaxed'>
              TcomicClub.com - Đọc Truyện Tranh Online Hoàn Toàn Miễn Phí - Nơi Thỏa Mãn Đam Mê.
            </p>
            <p className='text-xs mt-2 leading-relaxed'>
              Cập nhật các bộ truyện tranh hay, mới nhất, nhanh nhất để phục vụ độc giả, hỗ trợ trên
              mọi thiết bị.
            </p>
          </div>

          {/* Support */}
          <div>
            <h2 className='text-gray-900 dark:text-white text-xs font-semibold border-b border-primary pb-1.5 mb-3'>
              HỖ TRỢ
            </h2>
            <p className='text-xs leading-relaxed'>
              Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet. Chúng tôi không
              sở hữu hay chịu trách nhiệm bất kỳ thông tin nào trên web này. Nếu làm ảnh hưởng đến
              cá nhân hay tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className='text-gray-900 dark:text-white text-xs font-semibold border-b border-primary pb-1.5 mb-3'>
              LIÊN HỆ
            </h2>
            <div className='space-y-2'>
              <p className='text-xs leading-relaxed flex items-center gap-2'>
                <span className='text-primary'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                </span>
                tcomicvn@gmail.com
              </p>
              <div className='space-y-3'>
                <Link
                  to={PATH.privatePolicy}
                  className='text-primary dark:text-primary-2 hover:underline text-xs inline-flex items-center gap-1'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  CHÍNH SÁCH BẢO MẬT
                </Link>

                {/* Enhanced App Link */}
                <Link
                  to={PATH.app}
                  className='group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary to-primary-2 
                             hover:from-primary-2 hover:to-secondary text-white rounded-lg transition-all duration-300
                             shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 transition-transform duration-300 group-hover:scale-110'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
                  </svg>
                  <span className='text-sm font-medium'>TẢI ỨNG DỤNG TCOMIC</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Logo and Slogan */}
        <div className='text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800'>
          <div className='mb-2'>
            <span className='text-3xl logo-text-bold gradient-logo-text'>
              Tcomic
            </span>
          </div>
          <p className='text-sm font-medium gradient-logo-text'>
            Quality - Quickly - Quantity
          </p>
          <p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
            Copyright © {new Date().getFullYear()} Tcomic. All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
