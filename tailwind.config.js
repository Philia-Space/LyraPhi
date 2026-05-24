/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'jlpt-n5': '#22c55e',
        'jlpt-n4': '#3b82f6',
        'jlpt-n3': '#f59e0b',
        'jlpt-n2': '#f97316',
        'jlpt-n1': '#ef4444',
        'section-grammar': '#8b5cf6',
        'section-reading': '#06b6d4',
        'section-listening': '#ec4899',
        slate: {
          50: '#f4f6f8',
          100: '#e9edf2',
          200: '#d1dbe5',
          300: '#adbccb',
          400: '#8a9bad',
          500: '#64748b',
          600: '#475569',
          700: '#384c66',
          800: '#1f2d3d',
          900: '#161f30',
          950: '#0d131f'
        }
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"BIZ UDPGothic"',
          '"Yu Gothic"',
          '"YuGothic"',
          '"Noto Sans JP"',
          '"Meiryo"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
    },
  },
  plugins: [],
};
