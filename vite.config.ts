import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GITHUB_PAGES=true is set only in the GitHub Actions deploy workflow.
// All other hosts (Netlify, Vercel, Cloudflare Pages, local) use base '/'.
export default defineConfig({
  plugins: [react()],
  base:
    process.env.VITE_CDN_BASE ||
    (process.env.GITHUB_PAGES === 'true' ? '/mavic-portfolio/' : '/'),
})
