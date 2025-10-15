import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  // Vercel deployment: base path must be '/' since Root Directory is 'super-admin'
  base: '/',
  server: {
    port: 3001,
    host: 'localhost',
    strictPort: true, // don't auto-switch ports if 3001 is taken
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
