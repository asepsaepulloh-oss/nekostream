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
        neu: {
          bg: '#171923',
          surface: '#202431',
          light: '#292F3E',
          text: '#F1F3F9',
          muted: '#A1A8BA',
          accent: '#9B8CFF',
          secondary: '#73D6D0',
          error: '#FF7777',
          // Light Mode
          lightBg: '#E6E9F0',
          lightSurface: '#EEF2F9',
          lightText: '#1E2330',
          lightMuted: '#6B7280',
        }
      },
      boxShadow: {
        'neu-flat': '7px 7px 16px #131620, -7px -7px 16px #2d3242',
        'neu-inset': 'inset 5px 5px 10px #131620, inset -5px -5px 10px #2d3242',
        'neu-btn': '4px 4px 9px #131620, -4px -4px 9px #2d3242',
        'neu-btn-active': 'inset 4px 4px 8px #131620, inset -4px -4px 8px #2d3242',
        'neu-light-flat': '6px 6px 14px #c8cdd7, -6px -6px 14px #ffffff',
        'neu-light-inset': 'inset 4px 4px 8px #c8cdd7, inset -4px -4px 8px #ffffff',
      }
    },
  },
  plugins: [],
}
