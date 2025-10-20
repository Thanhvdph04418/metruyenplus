import { useEffect, useState } from 'react'

const LunarNewYearCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fut = new Date('Jan 29, 2025 00:00:00').getTime()
    const now = new Date().getTime()

    // Check if already expired
    if (now > fut) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      const currentTime = new Date().getTime()
      const D = fut - currentTime

      if (D < 0) {
        clearInterval(timer)
        setIsExpired(true)
        return
      }

      setTimeLeft({
        days: Math.floor(D / (1000 * 60 * 60 * 24)),
        hours: Math.floor((D / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((D / (1000 * 60)) % 60),
        seconds: Math.floor((D / 1000) % 60)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isExpired) return null

  return (
    <div className='countdown-container'>
      <div className='countdown-circles'>
        <div className='countdown-item'>
          <span className='countdown-number'>{timeLeft.days}</span>
          <span className='countdown-label'>N</span>
        </div>
        <div className='countdown-item'>
          <span className='countdown-number'>{timeLeft.hours}</span>
          <span className='countdown-label'>G</span>
        </div>
        <div className='countdown-item'>
          <span className='countdown-number'>{timeLeft.minutes}</span>
          <span className='countdown-label'>P</span>
        </div>
        <div className='countdown-item'>
          <span className='countdown-number'>{timeLeft.seconds}</span>
          <span className='countdown-label'>S</span>
        </div>
      </div>

      <style>{`
      .countdown-container {
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: transparent;
      }

      .countdown-circles {
        display: flex;
        gap: 0.5rem;
      }

      .countdown-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #ff3333;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        min-width: 2.5rem;
      }

      .countdown-number {
        color: white;
        font-size: 1rem;
        font-weight: bold;
        line-height: 1;
      }

      .countdown-label {
        color: white;
        font-size: 0.75rem;
        line-height: 1;
        }
      `}</style>
    </div>
  )
}

export default LunarNewYearCountdown
