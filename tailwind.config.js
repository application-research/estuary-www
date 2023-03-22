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
    // screens: {
    //   mobile: '900px',
    //   // => @media (min-width: 640px) { ... }
    // },

    extend: {
      blur: {
        custom: '150px',
      },
      backdropBlur: {
        custom: '250px',
      },
      colors: {
        primary: '#0C0B0B',
        secondary: '#0BFF48',
        darkGreen: '#0A7225',
        lightBlack: '#1A1919',
        neon: '#40B1D4',
        emerald: '#62EEDD',
      },
      width: {
        128: '32rem',
        blur: '60rem',
        '50rem': '50rem',
      },
      height: {
        85: '70vh ',
      },
    },
  },
  plugins: [],
};
