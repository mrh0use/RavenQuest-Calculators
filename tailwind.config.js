// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust based on your project structure
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['group-hover'], // Enable group-hover for display utilities
    },
  },
  plugins: [],
};
