import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#badcff',
          300: '#8ec6ff',
          400: '#59a8ff',
          500: '#2d8cff',
          600: '#1d6ae8',
          700: '#1d53c4',
          800: '#1d499f',
          900: '#1e3d7d',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45,140,255,0.2), 0 18px 40px rgba(19,32,68,0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config;
