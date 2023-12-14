/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'default': '#2a3042',
      },
      gradientColorStops: ({
        'green-transparent': 'rgba(0, 255, 0, 0.5)',
      }),
    },
  },
  plugins: [],
}

