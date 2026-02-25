import { useState, useEffect } from 'react'
// import FallingFlowers from './FallingFlowers'

interface Props {
  enabled?: boolean
}

const LunarNewYearCouplets = ({ enabled = true }: Props) => {
  const [isShow, setIsShow] = useState(enabled)

  useEffect(() => {
    setIsShow(enabled)
  }, [enabled])

  if (!isShow) return null

  return (
    <>
      {/* <FallingFlowers enabled={isShow} /> */}
      <div className='lunar-new-year-background'></div>
      <style>{`
        .lunar-new-year-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
        }

        /* Light mode background styles */
        @media (prefers-color-scheme: light) {
          .lunar-new-year-background {
            background: linear-gradient(135deg, #fff6e5 0%, #ffedcc 100%);
            background-image: 
              radial-gradient(#ff3333 1px, transparent 1px),
              radial-gradient(#ff3333 1px, transparent 1px);
            background-size: 50px 50px;
            background-position: 0 0, 25px 25px;
            background-attachment: fixed;
            opacity: 0.15;
          }
        }

        .fixed-couplets {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
        }

        .atn-tet-left, .atn-tet-right {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 250px;
          z-index: 10;
          pointer-events: auto;
        }

        .atn-tet-left {
          left: 0;
        }

        .atn-tet-right {
          right: 0;
        }

        .atn-tet-left img, .atn-tet-right img {
          width: 100%;
          height: auto;
          display: block;
        }

        .couplet-toggle {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          pointer-events: auto;
          z-index: 1000;
        }

        @media (max-width: 1524px) {
          .atn-tet-left,
          .atn-tet-right {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default LunarNewYearCouplets
