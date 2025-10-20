import React, { useEffect } from 'react'

interface AdBannerMobileProps {
  className?: string
}

const AdBannerMobile: React.FC<AdBannerMobileProps> = ({ className = '' }) => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      atOptions = {
        'key': 'e3e5e04ba7669291f6b0b470eb5ffe20',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
    `

    // Find the ad container and append script
    const adContainer = document.getElementById('ad-banner-mobile-container')
    if (adContainer) {
      adContainer.appendChild(script)

      // Create the ad script loader
      const adScript = document.createElement('script')
      adScript.type = 'text/javascript'
      adScript.src = '//www.highperformanceformat.com/e3e5e04ba7669291f6b0b470eb5ffe20/invoke.js'
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
    <div className={`w-full lg:hidden flex justify-center items-center py-4 ${className}`}>
      {/* Fixed dimensions container to prevent CLS */}
      <div
        className='relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden'
        style={{
          width: '300px',
          height: '250px',
          maxWidth: '100%'
        }}
      >
        {/* Placeholder content */}
        <div className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm'>
          <span>Advertisement</span>
        </div>

        {/* Ad container where script will be injected */}
        <div id='ad-banner-mobile-container' className='w-full h-full relative z-10' />
      </div>
    </div>
  )
}

export default AdBannerMobile
