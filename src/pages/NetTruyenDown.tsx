import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PATH from '@/utils/path'

const SITE_URL = 'https://nettruyenstore.com'

const FAQS = [
  {
    q: 'Tại sao NetTruyen không vào được?',
    a: 'NetTruyen thường bị nhà mạng Việt Nam chặn DNS hoặc tên miền hết hạn. Trang web thường phải chuyển sang domain mới để lách chặn. Điều này gây bất tiện lớn cho người dùng.'
  },
  {
    q: 'Link NetTruyen mới nhất 2025 là gì?',
    a: 'NetTruyen liên tục thay đổi domain nên không có link cố định. Thay vì tìm link mới, hãy sử dụng NetTruyenStore (nettruyenstore.com) — bản chính thức kế thừa NetTruyen, hoạt động ổn định, có app di động chính thức và kho truyện 50,000+ bộ.'
  },
  {
    q: 'Cách vào NetTruyen khi bị chặn?',
    a: 'Bạn có thể dùng VPN hoặc đổi DNS sang 8.8.8.8 (Google DNS). Tuy nhiên, cách đơn giản hơn là chuyển sang NetTruyenStore — không cần VPN, không cần đổi DNS, truy cập trực tiếp từ bất kỳ nhà mạng nào tại Việt Nam.'
  },
  {
    q: 'NetTruyenStore có đủ truyện như NetTruyen không?',
    a: 'Có. NetTruyenStore có hơn 50,000 bộ truyện Manga, Manhwa, Manhua — bao gồm hầu hết các bộ phổ biến trên NetTruyen. Truyện được dịch sang tiếng Việt và cập nhật nhanh, thường cùng lúc hoặc sớm hơn NetTruyen.'
  },
  {
    q: 'NetTruyenStore có ứng dụng điện thoại không?',
    a: 'Có! NetTruyenStore có ứng dụng chính thức cho iOS (App Store) và Android (Google Play). Ứng dụng hỗ trợ đọc offline, đồng bộ lịch sử đọc và nhận thông báo chương mới — tính năng mà NetTruyen không có.'
  }
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a
    }
  }))
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cách đọc truyện khi NetTruyen không vào được',
  description:
    'Hướng dẫn đơn giản để tiếp tục đọc truyện tranh khi NetTruyen bị chặn hoặc không truy cập được.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Mở trình duyệt',
      text: 'Mở trình duyệt Chrome, Safari hoặc Firefox trên điện thoại hoặc máy tính của bạn.'
    },
    {
      '@type': 'HowToStep',
      name: 'Truy cập NetTruyenStore',
      text: 'Nhập địa chỉ nettruyenstore.com vào thanh địa chỉ và nhấn Enter.'
    },
    {
      '@type': 'HowToStep',
      name: 'Tìm truyện yêu thích',
      text: 'Sử dụng thanh tìm kiếm để tìm tên truyện bạn đang đọc trên NetTruyen.'
    },
    {
      '@type': 'HowToStep',
      name: 'Tiếp tục đọc',
      text: 'Chọn chapter bạn đang đọc dở và tiếp tục. Toàn bộ truyện đều miễn phí!'
    }
  ]
}

const STEPS = [
  { step: '1', title: 'Mở trình duyệt', desc: 'Chrome, Safari hoặc Firefox đều được.' },
  {
    step: '2',
    title: 'Vào nettruyenstore.com',
    desc: 'Nhập địa chỉ và nhấn Enter. Không cần VPN.'
  },
  {
    step: '3',
    title: 'Tìm tên truyện',
    desc: 'Dùng ô tìm kiếm — hầu hết truyện từ NetTruyen đều có ở đây.'
  },
  {
    step: '4',
    title: 'Đọc tiếp!',
    desc: 'Chọn chương đang dở và đọc. Hoàn toàn miễn phí, không quảng cáo phiền.'
  }
]

const NetTruyenDown = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-neutral-900'>
      <Helmet>
        <title>NetTruyen Không Vào Được? Đọc Truyện Tại NetTruyenStore Ngay</title>
        <meta
          name='description'
          content='NetTruyen không vào được, bị chặn hoặc sập? Truy cập NetTruyenStore ngay — bản chính thức của NetTruyen, 50,000+ truyện Manga Manhwa Manhua miễn phí, không bị chặn, có app iOS Android!'
        />
        <meta
          name='keywords'
          content='nettruyen không vào được, nettruyen bị chặn, nettruyen sập, link nettruyen mới, nettruyen 2025, thay thế nettruyen, đọc truyện online, nettruyenstore'
        />
        <link rel='canonical' href={`${SITE_URL}${PATH.nettruyenDown}`} />
        <meta
          property='og:title'
          content='NetTruyen Không Vào Được? Dùng NetTruyenStore Thay Thế'
        />
        <meta
          property='og:description'
          content='NetTruyen bị chặn? NetTruyenStore có 50,000+ truyện miễn phí, không cần VPN, có app di động. Truy cập ngay!'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`${SITE_URL}${PATH.nettruyenDown}`} />
        <meta property='og:site_name' content='NetTruyenStore' />
        <meta property='og:locale' content='vi_VN' />
        <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>
        <script type='application/ld+json'>{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        {/* Hero */}
        <section className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-2 rounded-full mb-6'>
            <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
            NetTruyen đang gặp sự cố
          </div>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white'>
            NetTruyen Không Vào Được? <br />
            <span className='text-primary'>Dùng NetTruyenStore Ngay!</span>
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8'>
            Không cần tìm link mới, không cần VPN.{' '}
            <strong className='text-gray-900 dark:text-white'>NetTruyenStore</strong> luôn hoạt động
            ổn định với <strong className='text-gray-900 dark:text-white'>50,000+ bộ truyện</strong>{' '}
            — đủ mọi thể loại bạn yêu thích trên NetTruyen.
          </p>
          <Link
            to={PATH.home}
            className='inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity'
          >
            Đọc Truyện Miễn Phí Ngay
          </Link>
        </section>

        {/* How-to Steps */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
            3 bước đơn giản để tiếp tục đọc truyện
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {STEPS.map((s) => (
              <div
                key={s.step}
                className='bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm text-center'
              >
                <div className='w-10 h-10 rounded-full bg-primary text-white font-black text-lg flex items-center justify-center mx-auto mb-3'>
                  {s.step}
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white mb-2'>{s.title}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* App CTA */}
        <section className='mb-16 bg-gradient-to-r from-orange-500 to-primary rounded-2xl p-10 text-white text-center'>
          <h2 className='text-2xl font-black mb-3'>Không bao giờ lo NetTruyen sập nữa</h2>
          <p className='text-orange-100 max-w-md mx-auto mb-6'>
            Tải ứng dụng NetTruyenStore để đọc offline, nhận thông báo chương mới và đồng bộ lịch sử
            đọc trên mọi thiết bị.
          </p>
          <Link
            to={PATH.app}
            className='inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity'
          >
            Tải App NetTruyenStore
          </Link>
        </section>

        {/* FAQ */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
            Câu hỏi thường gặp
          </h2>
          <div className='space-y-4'>
            {FAQS.map((faq) => (
              <div key={faq.q} className='bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm'>
                <h3 className='font-bold text-gray-900 dark:text-white mb-2'>{faq.q}</h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal nav links */}
        <nav className='text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-4 justify-center'>
          <Link to={PATH.nettruyenAlternative} className='hover:text-primary transition-colors'>
            So sánh NetTruyenStore vs NetTruyen
          </Link>
          <Link to={PATH.popular} className='hover:text-primary transition-colors'>
            Truyện nổi bật
          </Link>
          <Link to={PATH.new} className='hover:text-primary transition-colors'>
            Truyện mới nhất
          </Link>
          <Link to={PATH.top} className='hover:text-primary transition-colors'>
            Bảng xếp hạng
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default NetTruyenDown
