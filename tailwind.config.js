/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#08080a',
          dark: '#111114',
          card: '#16161a',
          border: '#24242c',
          accent: '#ffffff',
          gray: '#8a8d9b',
          lightGray: '#b5b7c0'
        }
      }
    },
  },
  plugins: [],
};
