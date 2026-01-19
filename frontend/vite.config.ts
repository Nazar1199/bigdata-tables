import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://bigdata-tables-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
