import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In build mode, set the base to the GitHub Pages project path.
// In dev mode, keep root '/' so localhost works normally.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/mavic-portfolio/' : '/',
}))
