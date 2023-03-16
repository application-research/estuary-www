/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      blur: {
        custom: '250px',
      },
      backdropBlur: {
        custom: '250px',
      },
      colors: {
        primary: '#0C0B0B',
        neon: '#40B1D4',
        emerald: '#62EEDD',
      },
      width: {
        128: '32rem',
        blur: '60rem',
      },
      height: {
        85: '85vh ',
      },
    },
  },
  plugins: [],
};
