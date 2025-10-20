import React, { useEffect } from 'react'

interface AdBannerDesktopProps {
  className?: string
}

const AdBannerDesktop: React.FC<AdBannerDesktopProps> = ({ className = '' }) => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      atOptions = {
        'key': '1c3f1f7d1cf13df5ebae90dd1bfc2685',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
    `

    // Find the ad container and append script
    const adContainer = document.getElementById('ad-banner-desktop-container')
    if (adContainer) {
      adContainer.appendChild(script)

      // Create the ad script loader
      const adScript = document.createElement('script')
      adScript.type = 'text/javascript'
      adScript.src = '//www.highperformanceformat.com/1c3f1f7d1cf13df5ebae90dd1bfc2685/invoke.js'
      adContainer.appendChild(adScript)
    }

    // Cleanup function
    return () => {
      if (adContainer) {
        // Remove all script children when component unmounts
        const scripts = adContainer.querySelectorAll('script')
        scripts.forEach((script) => script.remove())
      }
    }
  }, [])

  return (
    <div className={`w-full hidden lg:flex justify-center items-center py-4 ${className}`}>
      {/* Fixed dimensions container to prevent CLS */}
      <div
        className='relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden'
        style={{
          width: '728px',
          height: '90px',
          maxWidth: '100%'
        }}
      >
        {/* Placeholder content */}
        <div className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm'>
          <span>Advertisement</span>
        </div>

        {/* Ad container where script will be injected */}
        <div id='ad-banner-desktop-container' className='w-full h-full relative z-10' />
      </div>
    </div>
  )
}

export default AdBannerDesktop
