/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BoundaryLab Brand Colors
        primary: {
          50: '#fef7f9',
          100: '#feeef2',
          200: '#fedde6',
          300: '#fcc2d0',
          400: '#f899b0',
          500: '#e4a9bd', // Main brand color
          600: '#d088a4',
          700: '#b8678a',
          800: '#985373',
          900: '#7d4460',
          950: '#472430',
        },
        accent: {
          50: '#f0fbfe',
          100: '#dbf4fd',
          200: '#c0edfa',
          300: '#9ed5e8', // Main accent color
          400: '#6bc5f0',
          500: '#47aae1',
          600: '#3089c0',
          700: '#286e9b',
          800: '#275e80',
          900: '#254f6a',
          950: '#193247',
        },
        background: {
          primary: '#fffbf3', // Main background color
          secondary: '#ffffff', // Pure white for cards
        },
        text: {
          primary: '#000000', // Black text
          secondary: '#374151', // Dark gray for secondary text
          muted: '#6b7280', // Muted gray for tertiary text
        },
        // Keep secondary blue for now (can be removed later if not needed)
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
