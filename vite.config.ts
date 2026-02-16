import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Copy _headers file to dist after build
const copyHeadersPlugin = () => ({
  name: 'copy-headers',
  closeBundle() {
    const src = path.resolve(__dirname, '_headers')
    const dest = path.resolve(__dirname, 'dist', '_headers')
    
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
      console.log('✅ Copied _headers to dist folder')
    }
  }
})

export default defineConfig({
  plugins: [react(), copyHeadersPlugin()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  }
})
