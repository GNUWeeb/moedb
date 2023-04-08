/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        accent: "var(--color-bg-accent)",
      },
      textColor: {
        accent: "var(--color-text-accent)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
      },
    },
    colors: {
      'dark-primary': '#131a1c',
      'dark-secondary': '#1b2224',
      'dark-text': '#5e6378',
      gray1: "#3c3f49",
      aqua: '#51a39f',
      red: '#e74c4c',
      pink: '#d17287',
      green: '#6bb05d',
      yellow: '#e59e67',
      blue: '#58acc4',
      purple: '#cd69cc',
      white: '#fff',
    },
  },
  plugins: [],
}
