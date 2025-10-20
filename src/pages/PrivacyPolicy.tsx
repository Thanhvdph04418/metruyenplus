import { useScrollTop } from '@/hooks'

const PrivacyPolicy = () => {
  useScrollTop()

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-200'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center'>
            Chính sách bảo mật
          </h1>

          <section className='mb-10'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2'>
              I. Giới thiệu
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              Địa chỉ website:{' '}
              <a
                href={import.meta.env.VITE_URL_WEBSITE}
                className='text-blue-600 dark:text-blue-400 hover:underline'
              >
                {import.meta.env.VITE_URL_WEBSITE}
              </a>
              , website đọc truyện tranh online miễn phí.
            </p>
          </section>

          <section className='mb-10'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2'>
              II. Thu thập và Sử dụng Thông tin
            </h2>

            <div className='space-y-8'>
              <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
                <h3 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100'>
                  1. Thông tin cá nhân
                </h3>
                <p className='text-gray-700 dark:text-gray-300 mb-3 leading-relaxed'>
                  Chúng tôi chỉ thu thập những thông tin cần thiết bao gồm:
                </p>
                <ul className='list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300'>
                  <li>Tên người dùng và email (khi bình luận hoặc đăng ký)</li>
                  <li>Avatar (nếu đăng nhập qua mạng xã hội)</li>
                  <li>Thông tin đọc truyện (truyện đã xem, theo dõi, đánh giá)</li>
                </ul>
              </div>

              <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
                <h3 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100'>
                  2. Cookies và Local Storage
                </h3>
                <p className='text-gray-700 dark:text-gray-300 mb-3 leading-relaxed'>
                  Chúng tôi sử dụng cookies và local storage để:
                </p>
                <ul className='list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300'>
                  <li>Lưu trạng thái đăng nhập</li>
                  <li>Ghi nhớ tùy chọn người dùng</li>
                  <li>Theo dõi tiến độ đọc truyện</li>
                  <li>Lưu danh sách truyện yêu thích và theo dõi</li>
                </ul>
              </div>

              <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
                <h3 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100'>
                  3. Phân tích và Hiệu suất
                </h3>
                <p className='text-gray-700 dark:text-gray-300 mb-3 leading-relaxed'>
                  Chúng tôi sử dụng các công cụ phân tích để cải thiện dịch vụ:
                </p>
                <ul className='list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300'>
                  <li>Google Analytics để theo dõi lưu lượng truy cập</li>
                  <li>Đánh giá hiệu suất hệ thống</li>
                  <li>Phát hiện và ngăn chặn spam</li>
                </ul>
              </div>
            </div>
          </section>

          <section className='mb-10'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2'>
              III. Bảo vệ Thông tin
            </h2>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
              <ul className='list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300'>
                <li>Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba</li>
                <li>Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn ngành</li>
                <li>Người dùng có quyền yêu cầu xóa thông tin cá nhân</li>
              </ul>
            </div>
          </section>

          <section className='mb-10'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2'>
              IV. Quyền của Người dùng
            </h2>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
              <p className='text-gray-700 dark:text-gray-300 mb-3 font-medium'>Bạn có quyền:</p>
              <ul className='list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300'>
                <li>Truy cập và chỉnh sửa thông tin cá nhân</li>
                <li>Yêu cầu xóa tài khoản và dữ liệu liên quan</li>
                <li>Từ chối việc thu thập thông tin không cần thiết</li>
                <li>Nhận bản sao dữ liệu cá nhân của bạn</li>
              </ul>
            </div>
          </section>

          <section className='mb-10'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2'>
              V. Nội dung Bên thứ ba
            </h2>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                Website có thể chứa liên kết đến các trang web khác. Chúng tôi không chịu trách
                nhiệm về chính sách bảo mật hoặc nội dung của các trang web này.
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2'>
              VI. Thay đổi Chính sách
            </h2>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6'>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông
                báo trên website.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
