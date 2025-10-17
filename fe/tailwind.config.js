/** @type {import('tailwindcss').Config} */
module.exports = {
  // Pastikan path konten ini sesuai dengan lokasi file JSX/TSX Anda
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Definisikan keyframes untuk fade-in
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      // 2. Terapkan keyframes ke properti 'animation'
      animation: {
        // Kelas yang Anda panggil di JSX: animate-fadeIn
        fadeIn: 'fadeIn 0.5s ease-in-out forwards', 
      },
    },
  },
  plugins: [],
}