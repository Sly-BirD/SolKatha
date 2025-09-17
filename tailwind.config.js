/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'purple-900': '#4B0082', // Deep purple (wisdom)
        'gold-200': '#FFD700',  // Warm gold (hope)
        'teal-500': '#008080',  // Teal (healing)
      },
    },
  },
  plugins: [],
};