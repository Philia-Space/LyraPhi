/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
    },
  },
  plugins: [],
};
