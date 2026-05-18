import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const singleFile = process.env.VITE_SINGLE_FILE === 'true'

export default defineConfig({
  plugins: singleFile ? [react(), viteSingleFile()] : [react()],
  base: process.env.VITE_CDN_BASE || '/',
  build: {
    assetsInlineLimit: singleFile ? 100_000_000 : 4096,
  },
})
