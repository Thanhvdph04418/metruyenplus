import { useEffect } from 'react'

/**
 * EveningModeToggle - A component that adds an evening reading mode
 * to reduce eye strain during nighttime reading
 * TEMPORARILY DISABLED
 */
export default function EveningModeToggle() {
  // Clean up any existing evening mode
  useEffect(() => {
    // Remove evening-mode class from HTML and body
    document.documentElement.classList.remove('evening-mode')
    document.body.classList.remove('evening-mode')

    // Remove from localStorage
    localStorage.removeItem('evening-mode')

    console.log('Evening mode has been temporarily disabled')
  }, [])

  // Return null to disable the component
  return null

  // ORIGINAL CODE (TEMPORARILY COMMENTED OUT):
  /*
  const [isEveningMode, setIsEveningMode] = useState(false)
  const [showStatus, setShowStatus] = useState(false)

  // Check if evening hours (7PM - 7AM)
  useEffect(() => {
    const checkEveningHours = () => {
      const currentHour = new Date().getHours()
      return currentHour >= 19 || currentHour < 7
    }
    
    // Auto-enable evening mode during evening hours if not explicitly set
    const eveningModeStored = localStorage.getItem('evening-mode')
    if (eveningModeStored === null && checkEveningHours()) {
      setIsEveningMode(true)
      applyEveningMode(true)
    } else if (eveningModeStored === 'true') {
      setIsEveningMode(true)
      applyEveningMode(true)
    }
  }, [])

  const toggleEveningMode = () => {
    const newMode = !isEveningMode
    setIsEveningMode(newMode)
    applyEveningMode(newMode)
    
    // Show status message
    setShowStatus(true)
    setTimeout(() => setShowStatus(false), 2000)
  }

  const applyEveningMode = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('evening-mode')
      document.body.classList.add('evening-mode')
      localStorage.setItem('evening-mode', 'true')
    } else {
      document.documentElement.classList.remove('evening-mode')
      document.body.classList.remove('evening-mode')
      localStorage.setItem('evening-mode', 'false')
    }
  }

  return (
    <>
      <button 
        onClick={toggleEveningMode}
        className={`evening-reading-mode ${isEveningMode ? 'evening-mode-active' : ''} ${className}`}
        title={isEveningMode ? 'Tắt chế độ đọc buổi tối' : 'Bật chế độ đọc buổi tối'}
        aria-label={isEveningMode ? 'Tắt chế độ đọc buổi tối' : 'Bật chế độ đọc buổi tối'}
      >
        {isEveningMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className={`evening-mode-status ${showStatus ? 'show' : ''}`}>
        {isEveningMode ? 'Đã bật chế độ đọc buổi tối' : 'Đã tắt chế độ đọc buổi tối'}
      </div>
    </>
  )
  */
}
