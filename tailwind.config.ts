import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'instrument': ['Instrument Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#009098",
          50: "#E6F8F9",
          100: "#CCF1F3",
          200: "#99E3E7",
          300: "#66D5DB",
          400: "#33C7CF",
          500: "#009098",
          600: "#007379",
          700: "#00565A",
          800: "#003A3C",
          900: "#001D1E",
        },
        secondary: {
          DEFAULT: "#009098",
          50: "#E6F8F9",
          100: "#CCF1F3",
          200: "#99E3E7",
          300: "#66D5DB",
          400: "#33C7CF",
          500: "#009098",
          600: "#007379",
          700: "#00565A",
          800: "#003A3C",
          900: "#001D1E",
        },
        accent: {
          DEFAULT: "#FAB623",
          50: "#FEF6E8",
          100: "#FDECD1",
          200: "#FBD9A3",
          300: "#F9C675",
          400: "#F7B347",
          500: "#FAB623",
          600: "#E09B0F",
          700: "#A8750B",
          800: "#704E08",
          900: "#382704",
        },
      },
    },
  },
  plugins: [],
}

export default config 