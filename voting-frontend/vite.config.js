import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['all'],
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9095',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})