/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'from-rose-900/80', 'via-red-800/60', 'to-orange-900/80',
    'from-emerald-900/80', 'via-teal-800/60', 'to-cyan-900/80',
    'from-amber-900/80', 'via-yellow-800/60',
    'bg-gradient-to-br', 'bg-gradient-to-b', 'bg-gradient-to-r',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        japan: {
          red: '#E53030',
          orange: '#FF6B35',
          gold: '#D4A847',
          dark: '#050508',
          surface: '#0C0D16',
          surface2: '#12141F',
          border: 'rgba(255,255,255,0.07)',
        },
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        'spin-border': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
