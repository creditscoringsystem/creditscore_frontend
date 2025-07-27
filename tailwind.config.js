/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {
    fontFamily: {
      sans: [
        'Inter',
        'ui-sans-serif',  
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"', 
        '"Roboto"',
        '"Helvetica Neue"',
        '"Arial"',
        '"Noto Sans"',
        '"Liberation Sans"',
        '"Fira Sans"',
        '"Droid Sans"',
        '"Ubuntu"',
        '"Cantarell"',
        '"Open Sans"',
      ],
    }
    fontWeights: {
      mid: 400,
  } },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        lime: '#B3FFAB',
        'mid-lime': '#9EFF88',
        bright: '#12FF75',
        emerald: '#0AC909',
        neon: '#00FF33',
        'icon-green': '#00B728',
        'gradient-1': '#2BB32A',
        'gradient-2': '#62FF46',
        mint: '#91F8C1',
        'dark-base': '#1A6D3A',
        'forest-green': '#2E6C4C',
        'gradient-shade': '#417853',
        'footer-gray': '#5F7468',
        'border-dark': '#465E52',
        'soft-gray': '#F5F5F5',
        'text-gray': '#707070',
        'border-light': '#E0E0E0',
        glow: '#C5FFC4',
        highlight: '#C2FFB0',
        'pastel-border': '#E0FFD4',
      },
    },
  },
};
