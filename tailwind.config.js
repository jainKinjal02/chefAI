// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
          playfair: ['"Playfair Display"', 'serif'],
        },
        animation: {
          fadeIn: 'fadeIn 0.5s ease-in',
          messageSlide: 'messageSlide 0.3s ease-out',
          slideInRight: 'slideInRight 0.5s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          messageSlide: {
            '0%': { 
              opacity: '0',
              transform: 'translateY(10px)'
            },
            '100%': { 
              opacity: '1',
              transform: 'translateY(0)'
            },
          },
          slideInRight: {
            '0%': { 
              opacity: '0',
              transform: 'translateX(20px)'
            },
            '100%': { 
              opacity: '1',
              transform: 'translateX(0)'
            },
          },
        },
      },
    },
    plugins: [],
  }