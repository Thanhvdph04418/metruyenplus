import { useEffect } from 'react'

const AppLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='bg-gradient-logo rounded-b-[50px] text-white text-center py-10 px-4 mb-8'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>
            Hành trình mới cùng ứng dụng truyện tranh Tcomic!
          </h1>
        </div>

        {/* Main Content */}
        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Banner */}
          <img
            src='https://s3.mpoint.vn/2c1d917c-4575-4e98-bcf8-76c8d23a3b59a%CC%89nh%20banner.jpg'
            alt='Comic App Banner'
            className='w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300'
            title='Comic App Banner'
          />

          {/* Journey Section */}
          <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300'>
            <h2 className='text-xl sm:text-2xl font-bold text-primary dark:text-primary-dark mb-4'>
              Cùng nhìn lại chặng đường 3 năm
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              Đã 3 năm trôi qua kể từ ngày chúng tôi bắt đầu hành trình mang thế giới truyện tranh
              đến gần hơn với bạn. Chúng tôi vô cùng biết ơn vì bạn đã đồng hành cùng chúng tôi
              trong suốt thời gian qua.
            </p>
          </section>

          {/* Features Section */}
          <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300'>
            <h2 className='text-xl sm:text-2xl font-bold text-primary dark:text-primary-dark mb-6'>
              Khám phá phiên bản mới đầy hứng khởi
            </h2>
            <ul className='list-disc ml-6 space-y-3 text-gray-700 dark:text-gray-300'>
              <li>
                Giao diện được thiết kế lại hoàn toàn, mang đến trải nghiệm đọc truyện mượt mà
              </li>
              <li>Hệ thống gợi ý truyện thông minh</li>
              <li>Chế độ đọc offline nâng cấp</li>
              <li>Cộng đồng thảo luận sôi nổi</li>
            </ul>

            {/* App Screenshots */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
              <img
                src='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/78/31/eb/7831eb5d-99f8-4564-dd41-9c930d9a0295/Apple_iPhone_11_Pro_Max_Screenshot_3.png/460x0w.webp'
                alt='App Screenshot 1'
                className='w-full rounded-lg shadow-md hover:scale-105 transition-all duration-300'
              />
              <img
                src='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/79/55/7e/79557e4f-f87e-a089-19b3-bea7891f83e2/Apple_iPhone_11_Pro_Max_Screenshot_5.png/460x0w.webp'
                alt='App Screenshot 2'
                className='w-full rounded-lg shadow-md hover:scale-105 transition-all duration-300'
              />
              <img
                src='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/f4/91/a1/f491a13d-42e7-c585-13bc-22e25d449120/Apple_iPhone_11_Pro_Max_Screenshot_6.png/460x0w.webp'
                alt='App Screenshot 3'
                className='w-full rounded-lg shadow-md hover:scale-105 transition-all duration-300 sm:col-span-2 md:col-span-1'
              />
            </div>
          </section>

          {/* Download Section */}
          <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300'>
            <h2 className='text-xl sm:text-2xl font-bold text-primary dark:text-primary-dark mb-6'>
              Tải ứng dụng ngay
            </h2>
            <div className='bg-primary/5 dark:bg-primary/10 rounded-xl p-6 md:p-8'>
              <div className='flex flex-col sm:flex-row justify-center items-center gap-8'>
                <div className='text-center group'>
                  <div className='bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300'>
                    <img
                      src='https://s3.mpoint.vn/bfe84f59-9146-409d-b1cf-8c5fbe74d483z5987310560727_49cdf530a09c2737f6ba94ba081814a6-min.jpg'
                      alt='Android QR Code'
                      className='w-32 h-32 mx-auto mb-3'
                    />
                    <p className='font-semibold text-gray-800 dark:text-gray-200'>Android</p>
                  </div>
                </div>
                <div className='text-center group'>
                  <div className='bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300'>
                    <img
                      src='https://s3.mpoint.vn/68c85293-51f9-4c40-953c-6cbbdd748accURL%20QR%20Code-min.png'
                      alt='iOS QR Code'
                      className='w-32 h-32 mx-auto mb-3'
                    />
                    <p className='font-semibold text-gray-800 dark:text-gray-200'>iOS</p>
                  </div>
                </div>
              </div>
              <p className='text-center mt-6 text-gray-600 dark:text-gray-400'>
                Quét mã QR để tải ứng dụng phù hợp với thiết bị của bạn
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AppLanding
