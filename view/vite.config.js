import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '192.168.1.48',
    // port: 5173,
    proxy: {
      '/api/': {
        target: 'https://xyzenterprise-zohajs.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
