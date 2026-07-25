/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0A08',
          900: '#12100C',
          800: '#1A1712',
          700: '#241F18',
          600: '#332C21',
        },
        parchment: {
          100: '#F5EFE0',
          200: '#EDE6D6',
          300: '#D9CFB6',
        },
        gold: {
          300: '#F0CD7A',
          400: '#E4B455',
          500: '#D4A24C',
          600: '#B3813A',
          700: '#8C632B',
        },
        ember: {
          400: '#E88866',
          500: '#DA6B45',
        },
        arcane: {
          300: '#8FE3EC',
          400: '#5AC8D9',
          500: '#3FA8BA',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        pixel: '4px 4px 0 0 rgba(0,0,0,0.45)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        windmillSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(14px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        shimmerBar: {
          '0%': { backgroundPosition: '0% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        floaty: '3s ease-in-out infinite floaty',
        windmill: 'windmillSpin 7s linear infinite',
        drift: 'drift 9s ease-in-out infinite',
        'pop-in': 'popIn 0.25s ease-out both',
        shimmer: 'shimmerBar 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
