import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const singleFile = process.env.VITE_SINGLE_FILE === 'true'

export default defineConfig({
  plugins: singleFile ? [react(), viteSingleFile()] : [react()],
  base: process.env.VITE_CDN_BASE || '/',
  build: {
    assetsInlineLimit: singleFile ? 100_000_000 : 4096,
    rollupOptions: singleFile ? {} : {
      output: {
        // Por ruta de paquete: con la forma de objeto, módulos compartidos acababan
        // en el trozo de three.js y el HTML lo precargaba en todas las páginas.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(three|@react-three)\//.test(id)) return 'three'
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-core'
          if (/node_modules\/(react-router|react-router-dom)\//.test(id)) return 'react-router'
          if (/node_modules\/framer-motion\//.test(id)) return 'framer'
          return undefined
        },
      },
    },
  },
})
