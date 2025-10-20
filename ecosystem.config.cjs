module.exports = {
  apps: [
    {
      name: 'tcomic-web',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 4004,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
} 