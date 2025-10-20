import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      // Bundle analyzer - only in build mode
      mode === 'production' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap'
      })
    ].filter(Boolean),
    server: {
      port: env.PORT ? parseInt(env.PORT) : 3000
    },
    css: {
      devSourcemap: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React ecosystem - Core framework
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }

            // UI/Component libraries
            if (id.includes('swiper') || id.includes('embla-carousel') || id.includes('react-icons')) {
              return 'ui-vendor'
            }

            // Utility libraries
            if (id.includes('lodash') || id.includes('dayjs') || id.includes('crypto-js') ||
                id.includes('axios') || id.includes('classnames') || id.includes('slugify')) {
              return 'utils-vendor'
            }

            // Authentication & JWT
            if (id.includes('@react-oauth') || id.includes('jwt-decode') || id.includes('react-ga4')) {
              return 'auth-vendor'
            }

            // PDF and heavy processing
            if (id.includes('@react-pdf') || id.includes('@tanstack')) {
              return 'pdf-vendor'
            }

            // React Query and state management
            if (id.includes('react-query') || id.includes('react-helmet')) {
              return 'query-vendor'
            }

            // Image and media libraries
            if (id.includes('react-lazy-load-image') || id.includes('react-hot-toast')) {
              return 'media-vendor'
            }

            // Database and storage
            if (id.includes('dexie')) {
              return 'storage-vendor'
            }

            // All other node_modules
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      // Optimize assets and compression
      assetsInlineLimit: 2048, // Reduced from 4096 for better chunking
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      // Enhanced minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      // Source maps only in dev
      sourcemap: mode === 'development'
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'dayjs',
        'lodash',
        'classnames'
      ]
    }
  }
})
