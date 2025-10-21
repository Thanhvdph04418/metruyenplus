interface AndroidApkModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
}

/**
 * Android APK Download Modal
 * Explains why app is not on Google Play and provides APK download
 */
const AndroidApkModal = ({ isOpen, onClose, onDownload }: AndroidApkModalProps) => {
  if (!isOpen) return null

  const handleDownload = () => {
    onDownload()
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Tải ứng dụng Tcomic
          </h2>
          <button
            onClick={onClose}
            className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-highlight transition-colors'
            aria-label='Đóng'
          >
            <svg
              className='w-5 h-5 text-gray-500 dark:text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-4 space-y-4'>
          {/* Explanation */}
          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              Tại sao không có trên Google Play?
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
              Ứng dụng Tcomic hiện tại không còn trên Google Play Store do các chính sách về nội
              dung. Tuy nhiên, bạn vẫn có thể tải và cài đặt ứng dụng thông qua file APK.
            </p>
          </div>

          {/* Security Commitment */}
          <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2'>
            <h3 className='font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2'>
              <span className='text-xl'>🔒</span>
              Cam kết bảo mật
            </h3>
            <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
              <li className='flex items-start gap-2'>
                <span className='text-green-600 dark:text-green-400 mt-0.5'>✓</span>
                <span>Không lừa đảo, không chứa mã độc</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-green-600 dark:text-green-400 mt-0.5'>✓</span>
                <span>Không thu thập dữ liệu cá nhân</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-green-600 dark:text-green-400 mt-0.5'>✓</span>
                <span>Ứng dụng chính thức từ Tcomic</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-green-600 dark:text-green-400 mt-0.5'>✓</span>
                <span>Hoàn toàn miễn phí, không quảng cáo phiền nhiễu</span>
              </li>
            </ul>
          </div>

          {/* Installation Instructions */}
          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>Hướng dẫn cài đặt APK</h3>
            <ol className='text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside'>
              <li>Nhấn nút "Tải APK" bên dưới</li>
              <li>Vào phần Cài đặt → Bảo mật → Bật "Nguồn không xác định"</li>
              <li>Mở file APK vừa tải về và nhấn "Cài đặt"</li>
              <li>Chờ quá trình cài đặt hoàn tất và mở ứng dụng</li>
            </ol>
          </div>

          {/* Note */}
          <div className='text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-dark-highlight p-3 rounded-lg'>
            <strong>Lưu ý:</strong> Nếu điện thoại cảnh báo "Ứng dụng không an toàn", hãy chọn "Vẫn
            cài đặt". Đây là cảnh báo chuẩn cho các ứng dụng không từ Google Play.
          </div>
        </div>

        {/* Actions */}
        <div className='p-4 border-t border-gray-200 dark:border-dark-border space-y-2'>
          <button
            onClick={handleDownload}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'
          >
            Tải APK ngay
          </button>
          <button
            onClick={onClose}
            className='w-full bg-gray-100 dark:bg-dark-highlight hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-xl transition-colors'
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  )
}

export default AndroidApkModal
