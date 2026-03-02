import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/pen-testing/',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
