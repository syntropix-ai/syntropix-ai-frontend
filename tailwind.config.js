/** @type {import('tailwindcss').Config} */
import prelinePlugin from 'preline/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [prelinePlugin,],
}

