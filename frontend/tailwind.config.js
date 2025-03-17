// frontend/tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Add your app path here
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-600': '#1D4ED8',
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'media', // Optional: enable dark mode
};
