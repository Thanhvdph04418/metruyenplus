interface Props {
  enabled?: boolean
}

const FallingFlowers = ({ enabled = true }: Props) => {
  if (!enabled) return null

  return (
    <div className='falling-flowers' aria-hidden='true'>
      <div className='flower' style={{ fontSize: '30px' }}>
        ✿
      </div>
      <div className='flower'>✿</div>
      <div className='flower' style={{ fontSize: '40px' }}>
        ✿
      </div>
      <div className='flower'>✿</div>
      <div className='flower' style={{ fontSize: '30px' }}>
        ✿
      </div>
      <div className='flower' style={{ fontSize: '22px' }}>
        ✿
      </div>
      <div className='flower' style={{ fontSize: '50px' }}>
        ✿
      </div>
      <div className='flower' style={{ fontSize: '20px' }}>
        ✿
      </div>
      <div className='flower' style={{ fontSize: '70px' }}>
        ✿
      </div>
      <div className='flower' style={{ fontSize: '20px' }}>
        ✿
      </div>

      <style>{`
        /* Hide on mobile devices */
        @media (max-width: 768px) {
          .falling-flowers {
            display: none;
          }
        }

        .falling-flowers {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9998;
        }

        .flower {
          color: #FFD700;
          position: fixed;
          top: -10%;
          z-index: 9999;
          user-select: none;
          cursor: default;
          animation: fall 10s linear infinite, sway 3s ease-in-out infinite;
        }

        .flower:nth-of-type(1) { left: 10%; animation-delay: 1s, 1s; }
        .flower:nth-of-type(2) { left: 20%; animation-delay: 6s, 0.5s; }
        .flower:nth-of-type(3) { left: 30%; animation-delay: 4s, 2s; }
        .flower:nth-of-type(4) { left: 40%; animation-delay: 2s, 2s; }
        .flower:nth-of-type(5) { left: 50%; animation-delay: 8s, 3s; }
        .flower:nth-of-type(6) { left: 60%; animation-delay: 6s, 2s; }
        .flower:nth-of-type(7) { left: 70%; animation-delay: 2.5s, 1s; }
        .flower:nth-of-type(8) { left: 80%; animation-delay: 1s, 0s; }
        .flower:nth-of-type(9) { left: 90%; animation-delay: 3s, 1.5s; }
        .flower:nth-of-type(10) { left: 95%; animation-delay: 5s, 2.5s; }

        @keyframes fall {
          0% { top: -10%; }
          100% { top: 100%; }
        }

        @keyframes sway {
          0% { transform: translateX(0px); }
          50% { transform: translateX(80px); }
          100% { transform: translateX(0px); }
        }
      `}</style>
    </div>
  )
}

export default FallingFlowers
