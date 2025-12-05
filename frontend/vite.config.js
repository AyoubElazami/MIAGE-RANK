import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http:
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http:
        ws: true,
        changeOrigin: true,
      },
    },
  },
})