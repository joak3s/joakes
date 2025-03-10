import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mada: ['var(--font-mada)', 'Helvetica', 'Arial', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'soft-space': 'linear-gradient(to right top, #1a1a2e, #16213e, #0f3460)',
        'dark-forest': 'linear-gradient(to top, #1f2a44, #2d3b55, #3e4a6e)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'gradient-flow': 'gradient-flow 4s linear infinite',
        'gradient-pulse': 'gradient-pulse 4s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '400% 50%' },
        },
        'gradient-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;