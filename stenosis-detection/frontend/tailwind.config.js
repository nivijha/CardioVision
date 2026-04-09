/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          gray: '#F5F5F7',
          text: '#1D1D1F',
          secondary: '#6E6E73',
          tertiary: '#86868B',
          border: '#D2D2D7',
          accent: '#0071E3',
          success: '#34C759',
          warning: '#FF9500',
          danger: '#FF3B30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'modal': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
