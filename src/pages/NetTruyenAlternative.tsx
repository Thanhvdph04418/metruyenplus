import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PATH from '@/utils/path'

const SITE_URL = 'https://nettruyenstore.com'

const FEATURES = [
  {
    icon: '📚',
    title: '50,000+ Bộ Truyện',
    desc: 'Kho truyện khổng lồ: Manga, Manhwa, Manhua, Webtoon — tất cả miễn phí, không cần đăng ký.'
  },
  {
    icon: '⚡',
    title: 'Cập Nhật Nhanh Nhất',
    desc: 'Chương mới được đăng tải ngay khi ra mắt, thường nhanh hơn các trang khác từ 1–6 giờ.'
  },
  {
    icon: '🖼️',
    title: 'Ảnh Chất Lượng Cao',
    desc: 'Không nén ảnh, không làm mờ. Trải nghiệm đọc sắc nét trên mọi thiết bị.'
  },
  {
    icon: '📱',
    title: 'Ứng Dụng iOS & Android',
    desc: 'Tải app NetTruyenStore để đọc offline, đồng bộ lịch sử đọc và nhận thông báo chương mới.'
  },
  {
    icon: '🚫',
    title: 'Không Quảng Cáo Phiền Nhiễu',
    desc: 'Giao diện sạch, không pop-up, không chuyển trang. Tập trung hoàn toàn vào truyện.'
  },
  {
    icon: '🔒',
    title: 'Không Bị Chặn',
    desc: 'NetTruyenStore luôn hoạt động ổn định. Truy cập nettruyenstore.com từ bất kỳ đâu.'
  }
]

const FAQS = [
  {
    q: 'Nettruyen không vào được, tôi nên đọc truyện ở đâu?',
    a: 'NetTruyenStore (nettruyenstore.com) là bản chính thức thay thế NetTruyen. Với 50,000+ bộ truyện được cập nhật liên tục, giao diện thân thiện và ứng dụng di động miễn phí, bạn sẽ không bao giờ bỏ lỡ chương mới yêu thích.'
  },
  {
    q: 'NetTruyenStore có những truyện giống NetTruyen không?',
    a: 'Có. NetTruyenStore có kho truyện rất lớn bao gồm hầu hết các bộ manga, manhwa, manhua phổ biến tương tự NetTruyen như One Piece, Naruto, Attack on Titan, Tower of God, Solo Leveling, và hàng chục nghìn bộ khác.'
  },
  {
    q: 'Tại sao nên dùng NetTruyenStore thay vì NetTruyen?',
    a: 'NetTruyenStore không bao giờ bị chặn hay sập như NetTruyen. Đây là bản chính thức kế thừa NetTruyen với ứng dụng di động chính thức (iOS & Android), giao diện không quảng cáo phiền nhiễu, ảnh chất lượng cao và tốc độ cập nhật nhanh.'
  },
  {
    q: 'NetTruyenStore có miễn phí không?',
    a: 'Hoàn toàn miễn phí! Bạn có thể đọc tất cả truyện trên NetTruyenStore mà không cần đăng ký tài khoản hay trả phí. Đăng ký tài khoản (miễn phí) giúp bạn đồng bộ lịch sử đọc và theo dõi truyện yêu thích.'
  },
  {
    q: 'NetTruyen bị chặn vĩnh viễn chưa?',
    a: 'NetTruyen thường xuyên thay đổi tên miền và gặp sự cố truy cập. Thay vì chờ đợi, hãy sử dụng NetTruyenStore — bản chính thức kế thừa NetTruyen, hoạt động ổn định, có ứng dụng di động và không phụ thuộc vào một domain duy nhất.'
  }
]

const POPULAR_GENRES = [
  { slug: 'action', name: 'Hành động' },
  { slug: 'romance', name: 'Tình cảm' },
  { slug: 'fantasy', name: 'Kỳ ảo' },
  { slug: 'comedy', name: 'Hài hước' },
  { slug: 'horror', name: 'Kinh dị' },
  { slug: 'isekai', name: 'Isekai' },
  { slug: 'slice-of-life', name: 'Đời thường' },
  { slug: 'sports', name: 'Thể thao' }
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NetTruyenStore',
  url: 'https://nettruyenstore.com',
  description:
    'NetTruyenStore — Bản chính thức của NetTruyen. Trang web đọc truyện tranh online miễn phí. 50,000+ bộ truyện Manga, Manhwa, Manhua cập nhật nhanh nhất.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}${PATH.search}?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}

const COMPARISON_ROWS = [
  { feature: 'Số lượng truyện', ours: '50,000+', theirs: '40,000+' },
  { feature: 'Ứng dụng di động', ours: '✅ iOS & Android', theirs: '❌ Không có' },
  { feature: 'Truy cập ổn định', ours: '✅ Luôn hoạt động', theirs: '❌ Hay bị chặn' },
  { feature: 'Quảng cáo', ours: '✅ Tối thiểu', theirs: '❌ Nhiều pop-up' },
  { feature: 'Đọc offline', ours: '✅ Qua app', theirs: '❌ Không hỗ trợ' },
  { feature: 'Miễn phí', ours: '✅ Hoàn toàn', theirs: '✅ Có' }
]

const NetTruyenAlternative = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-neutral-900'>
      <Helmet>
        <title>Thay Thế NetTruyen - Đọc Truyện Miễn Phí Tại NetTruyenStore</title>
        <meta
          name='description'
          content='NetTruyen không vào được? NetTruyenStore là bản chính thức thay thế NetTruyen. 50,000+ truyện Manga, Manhwa, Manhua miễn phí, cập nhật nhanh, không quảng cáo. Tải app ngay!'
        />
        <meta
          name='keywords'
          content='thay thế nettruyen, nettruyen không vào được, web đọc truyện như nettruyen, nettruyen bị chặn, nettruyen alternative, đọc truyện online miễn phí, nettruyenstore, truyện tranh online'
        />
        <link rel='canonical' href={`${SITE_URL}${PATH.nettruyenAlternative}`} />
        <meta
          property='og:title'
          content='Thay Thế NetTruyen - Đọc Truyện Miễn Phí Tại NetTruyenStore'
        />
        <meta
          property='og:description'
          content='NetTruyen không vào được? NetTruyenStore có 50,000+ truyện Manga, Manhwa, Manhua miễn phí. Cập nhật nhanh, ảnh đẹp, ứng dụng iOS & Android.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`${SITE_URL}${PATH.nettruyenAlternative}`} />
        <meta property='og:site_name' content='NetTruyenStore' />
        <meta property='og:locale' content='vi_VN' />
        <script type='application/ld+json'>{JSON.stringify(structuredData)}</script>
        <script type='application/ld+json'>{JSON.stringify(organizationSchema)}</script>
      </Helmet>

      <div className='container mx-auto px-4 py-12 max-w-5xl'>
        {/* Hero */}
        <section className='text-center mb-16'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white'>
            Thay Thế NetTruyen <span className='text-primary'>Tốt Nhất 2025</span>
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8'>
            NetTruyen không vào được? Đừng lo —{' '}
            <strong className='text-gray-900 dark:text-white'>NetTruyenStore</strong> có{' '}
            <strong className='text-gray-900 dark:text-white'>50,000+ bộ truyện</strong> Manga,
            Manhwa, Manhua, cập nhật liên tục,{' '}
            <strong className='text-gray-900 dark:text-white'>hoàn toàn miễn phí</strong>.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to={PATH.popular}
              className='inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity'
            >
              Đọc Truyện Ngay
            </Link>
            <Link
              to={PATH.app}
              className='inline-block border-2 border-primary text-primary font-bold px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors'
            >
              Tải App Miễn Phí
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
            Tại sao chọn NetTruyenStore?
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className='bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='text-3xl mb-3'>{f.icon}</div>
                <h3 className='font-bold text-gray-900 dark:text-white mb-2'>{f.title}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white'>
            So sánh NetTruyenStore vs NetTruyen
          </h2>
          <div className='overflow-x-auto rounded-2xl shadow'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-100 dark:bg-neutral-800'>
                <tr>
                  <th className='text-left p-4 font-bold text-gray-900 dark:text-white'>
                    Tính năng
                  </th>
                  <th className='p-4 font-bold text-primary'>NetTruyenStore</th>
                  <th className='p-4 font-bold text-gray-500 dark:text-gray-400'>NetTruyen</th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-neutral-900'>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-800/50' : ''}
                  >
                    <td className='p-4 text-gray-700 dark:text-gray-300'>{row.feature}</td>
                    <td className='p-4 text-center text-gray-900 dark:text-white'>{row.ours}</td>
                    <td className='p-4 text-center text-gray-500 dark:text-gray-400'>
                      {row.theirs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

        {/* Popular Genres */}
        <section className='mb-16'>
          <h2 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white'>
            Thể loại phổ biến
          </h2>
          <div className='flex flex-wrap gap-3 justify-center'>
            {POPULAR_GENRES.map((g) => (
              <Link
                key={g.slug}
                to={PATH.genres}
                className='px-4 py-2 bg-white dark:bg-neutral-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors shadow-sm'
              >
                {g.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className='text-center bg-gradient-to-r from-primary to-pink-500 rounded-2xl p-10 text-white mb-12'>
          <h2 className='text-2xl font-black mb-3'>Bắt Đầu Đọc Ngay Bây Giờ</h2>
          <p className='mb-6 text-white/90'>
            Hơn 10 triệu người dùng đã tin tưởng NetTruyenStore. Tham gia ngay và không bao giờ lo
            NetTruyen bị chặn nữa.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to={PATH.popular}
              className='bg-white text-primary font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity'
            >
              Xem Truyện Nổi Bật
            </Link>
            <Link
              to={PATH.recent}
              className='border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-primary transition-colors'
            >
              Truyện Mới Cập Nhật
            </Link>
          </div>
        </section>

        {/* Internal nav links */}
        <nav className='text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-4 justify-center'>
          <Link to={PATH.nettruyenDown} className='hover:text-primary transition-colors'>
            NetTruyen không vào được — giải pháp khắc phục
          </Link>
          <Link to={PATH.new} className='hover:text-primary transition-colors'>
            Truyện mới nhất
          </Link>
          <Link to={PATH.top} className='hover:text-primary transition-colors'>
            Bảng xếp hạng
          </Link>
          <Link to={PATH.completed} className='hover:text-primary transition-colors'>
            Truyện hoàn thành
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default NetTruyenAlternative
