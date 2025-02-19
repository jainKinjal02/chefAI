/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
          'playfair': ['"Playfair Display"', 'serif'],
        },
        colors: {
          'chef-red': {
            400: '#f47c7c',
            500: '#e05e5e',
          },
        },
      },
    },
    plugins: [],
  }