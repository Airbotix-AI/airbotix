import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/airbotix-website/' : '/', // 开发环境使用根路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 8080,
    host: '0.0.0.0', // 允许外部访问
    open: true
  }
})