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
      colors: {
        primary: {
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
          DEFAULT: "#02D866",
          50: "#E6FCF1",
          100: "#CCF9E2",
          200: "#99F3C6",
          300: "#66EDA9",
          400: "#33E78D",
          500: "#02D866",
          600: "#02AD52",
          700: "#01823D",
          800: "#015629",
          900: "#002B14",
        },
      },
    },
  },
  plugins: [],
}

export default config 