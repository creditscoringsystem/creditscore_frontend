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
    },
    fontWeights: {
      mid: 400,
  } },
  plugins: [],
}
