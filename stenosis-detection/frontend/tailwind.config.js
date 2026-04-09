/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FDFBF9',
          bgAlt: '#F9F7F5',
          surface: '#FFFFFF',
          surfaceAlt: '#FEFBF7',
          sand: '#F5F0EB',
          text: '#2D2A26',
          secondary: '#6B6258',
          tertiary: '#8B7E74',
          border: '#E8E0D9',
          borderWarm: '#DCD0C5',
          primary: '#C49A6C',
          primaryDark: '#A67C52',
          primaryLight: '#D4B593',
          coral: '#E07A5F',
          teal: '#6B9080',
          sage: '#A4B494',
          success: '#5B9A8B',
          warning: '#D4A373',
          danger: '#C77D63',
          accent: '#C49A6C',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(92, 68, 49, 0.08)',
        'elevated': '0 4px 16px rgba(92, 68, 49, 0.1)',
        'modal': '0 8px 40px rgba(92, 68, 49, 0.15)',
        'soft': '0 2px 8px rgba(92, 68, 49, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
