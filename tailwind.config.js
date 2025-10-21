/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    container: false
  },
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '400px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Nunito Fallback', 'system-ui', 'sans-serif'],
        comic: ['Comic Neue', 'Comic Neue Fallback', 'cursive'],
        title: ['Bangers', 'Bangers Fallback', 'cursive'],
        manga: ['Fredoka One', 'Fredoka One Fallback', 'Bangers', 'cursive'],
        comicBold: ['Fredoka One', 'Fredoka One Fallback', 'Bangers', 'cursive'],
        logo: ['Inter', 'Inter Fallback', 'Arial', 'sans-serif'],
        logoAlt: ['Poppins', 'Poppins Fallback', 'Arial', 'sans-serif'],
        logoBold: ['Poppins', 'Poppins Fallback', 'Arial Black', 'sans-serif']
      },
      colors: {
        primary: '#2196F3',          /* Medium blue from logo */
        'primary-2': '#06B6D4',      /* Teal from logo */
        secondary: '#4DC0B5',        /* Light teal accent */
        'comment-bg': '#F8FAFC',     /* Slate background */
        'dark-bg': '#0F172A',        /* Slate dark for dark mode */
        'dark-surface': '#1E293B',   /* Slate surface */
        'dark-highlight': '#334155', /* Lighter slate highlight */
        'light-bg': '#F8FAFC',       /* Very light slate */
        'light-surface': '#ffffff',
        'light-highlight': '#F1F5F9',
        'light-card': '#ffffff',
        'light-border': '#E2E8F0',
      },
      backgroundImage: {
        gradient: 'linear-gradient(135deg, #2196F3 0%, #06B6D4 100%)',
        'gradient-logo': 'linear-gradient(180deg, #2196F3 0%, #06B6D4 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, #2196F3 0%, #06B6D4 100%)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, #2196F3 0deg, #06B6D4 120deg, #4DC0B5 240deg, #2196F3 360deg)'
      },
      transitionDuration: {
        DEFAULT: '200ms',
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        scale: 'scale 0.2s ease-in-out',
        fadeIn: 'fadeIn 0.3s ease-out'
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(90px, 1fr))',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '38': '38px',
      },
      maxWidth: {
        'comment': '1000px',
        'gif': '300px'
      },
      borderRadius: {
        'comment': '10px'
      },
    }
  },
  plugins: [
    function ({ addComponents, addUtilities }) {
      addComponents({
        '.container': {
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
        '.comment-container': {
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          padding: '0 1rem'
        },
        '.comment-card': {
          backgroundColor: '#F8FAFC',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          marginBottom: '1rem',
          border: '1px solid #E2E8F0',
          '@screen dark': {
            backgroundColor: '#1E293B',
            borderColor: '#334155'
          }
        }
      });

      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
        },
        '.text-balance': {
          textWrap: 'balance'
        },
        '.break-word-safe': {
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        },
        // CLS Prevention Utilities
        '.aspect-comic': {
          aspectRatio: '3 / 4'
        },
        '.aspect-hot-comic': {
          aspectRatio: '4 / 5'  
        },
        '.aspect-logo': {
          aspectRatio: '3 / 1'
        },
        // Skeleton loading states
        '.skeleton': {
          backgroundColor: '#f3f4f6',
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          '&.dark': {
            backgroundColor: '#374151'
          }
        },
        '.skeleton-text': {
          height: '1rem',
          borderRadius: '0.25rem'
        },
        '.skeleton-title': {
          height: '1.5rem',
          borderRadius: '0.25rem'
        },
        // Layout stability utilities  
        '.stable-grid': {
          contain: 'layout style paint'
        },
        '.stable-transform': {
          willChange: 'transform',
          transformStyle: 'preserve-3d'
        },
        // Logo-inspired gradient utilities
        '.gradient-logo-text': {
          background: 'linear-gradient(180deg, #2196F3 0%, #06B6D4 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        },
        '.gradient-logo-border': {
          background: 'linear-gradient(180deg, #2196F3 0%, #06B6D4 100%)',
          padding: '2px',
          borderRadius: '0.5rem'
        },
        '.gradient-logo-shadow': {
          boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.3), 0 10px 10px -5px rgba(6, 182, 212, 0.2)'
        },
        // Logo-appropriate text effects
        '.logo-text': {
          fontFamily: 'Bangers, Bangers Fallback, Arial Black, sans-serif',
          fontWeight: '400',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        },
        '.logo-text-alt': {
          fontFamily: 'Fredoka One, Fredoka One Fallback, Arial Black, sans-serif',
          fontWeight: '400',
          letterSpacing: '0.05em'
        },
        '.logo-text-bold': {
          fontFamily: 'Bangers, Bangers Fallback, Arial Black, sans-serif',
          fontWeight: '400',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        },
        '.comic-text': {
          fontFamily: 'Fredoka One, Fredoka One Fallback, Bangers, cursive',
          textShadow: '2px 2px 0px rgba(0,0,0,0.1), 4px 4px 0px rgba(0,0,0,0.05)',
          letterSpacing: '0.05em'
        },
        '.comic-outline': {
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }
      })
    }
  ]
}
