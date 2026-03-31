/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqua-primary': {
          50: '#f0faff',
          100: '#e0f5ff',
          200: '#baeaff',
          300: '#7cd9ff',
          400: '#33c0ff',
          500: '#00a8ff',
          600: '#0087cc',
          700: '#006a99',
          800: '#00597d',
          900: '#064a69',
          950: '#042e45',
        },
        'aqua-dark': '#000814',
        'aqua-midnight': '#001d3d',
        'aqua-ocean': '#003566',
        'gold-primary': '#ffc300',
        'gold-light': '#ffd60a',
        'fish-orange': '#ff6b6b',
        'fish-green': '#51cf66',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -5px rgba(0, 0, 0, 0.05)',
        'aqua-glow': '0 0 20px rgba(0, 212, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
