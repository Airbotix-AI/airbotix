import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 只在生产环境使用 /super-admin/ 前缀（用于GitHub Pages）
  base: mode === 'production' ? '/super-admin/' : '/',
  server: {
    port: 3001,
    host: 'localhost',
    strictPort: true, // 如果端口被占用则失败，而不是自动切换端口
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}))
