/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brick: {
          dark: '#0f0d0d',
          charcoal: '#1b1a1a',
          stone: '#262626',
          accent: '#b63a2b',
          accentDark: '#8b1d2c',
          accentLight: '#d76d5b',
          sand: '#f2e8d5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'slide-up': 'slide-up 0.6s ease-out both',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'brick': '0 20px 60px rgba(0,0,0,0.35)',
        'brick-soft': '0 10px 30px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}

