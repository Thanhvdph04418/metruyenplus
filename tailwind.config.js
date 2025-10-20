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
        title: ['Bangers', 'Bangers Fallback', 'cursive']
      },
      colors: {
        primary: '#8B5CF6',          /* Purple primary */
        'primary-2': '#06B6D4',      /* Cyan secondary */
        secondary: '#10B981',        /* Emerald accent */
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
        gradient: 'linear-gradient(133deg, #8B5CF6 0%, #06B6D4 100%)'
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
        }
      })
    }
  ]
}
