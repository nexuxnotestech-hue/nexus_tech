/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        surface: '#121A2A',
        primary: '#A855F7',
        primaryLight: '#C084FC',
        accent: '#EC4899',
        secondary: '#60A5FA',
        secondaryLight: '#22D3EE',
        textWhite: '#FFFFFF',
        textSoft: '#D1D5DB',
        textMuted: '#9CA3AF'
      }
    },
  },
  plugins: [],
}
