/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0e14',
        panel: '#12161f',
        panelLight: '#181d29',
        border: '#242b3a',
        xp: '#7ee787',
        gold: '#f0d264',
        danger: '#ff6b6b',
        ink: '#c9d1d9',
        dim: '#5b6472',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        pixel: '4px 4px 0 0 rgba(0,0,0,0.5)',
        pixelSm: '2px 2px 0 0 rgba(0,0,0,0.5)',
        glowXp: '0 0 12px rgba(126,231,135,0.5)',
        glowGold: '0 0 12px rgba(240,210,100,0.5)',
      },
      keyframes: {
        jump: {
          '0%': { transform: 'translate(0,0)' },
          '35%': { transform: 'translate(30px,-46px)' },
          '100%': { transform: 'translate(60px,0)' },
        },
        fall: {
          '0%': { transform: 'translate(0,0) rotate(0deg)' },
          '100%': { transform: 'translate(-20px,20px) rotate(-18deg)' },
        },
        flip: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 4px' },
        },
      },
      animation: {
        jump: 'jump 0.6s ease-out forwards',
        fall: 'fall 0.5s ease-in forwards',
        flip: 'flip 0.8s linear',
        bob: 'bob 1.6s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};
