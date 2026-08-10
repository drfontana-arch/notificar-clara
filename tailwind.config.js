/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        judicial: {
          azul: '#1a5276',
          claro: '#2e86c1',
          fondo: '#f4f6f7',
        }
      }
    }
  },
  plugins: []
}
