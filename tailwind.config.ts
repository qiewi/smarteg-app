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
        'argesta': ['Argesta Display', 'serif'],
        'eb-garamond': ['EB Garamond', 'serif'],
        'inter': ['Inter', 'sans-serif'],
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
        primer: {
          DEFAULT: "#014B3E",
          50: "#E6F2F0",
          100: "#CCE5E1",
          200: "#99CBC2",
          300: "#66B1A4",
          400: "#339785",
          500: "#014B3E",
          600: "#013C32",
          700: "#012D25",
          800: "#001E19",
          900: "#000F0C",
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
          50: "#FEF9E7",
          100: "#FDF3CF",
          200: "#FBE79F",
          300: "#F9DB6F",
          400: "#F7CF3F",
          500: "#FAB623",
          600: "#C8921C",
          700: "#966D15",
          800: "#64490E",
          900: "#322407",
        },
      },
    },
  },
  plugins: [],
}

export default config 