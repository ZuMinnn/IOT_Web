/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Temperature colors
        temp: {
          cold: '#60A5FA',
          normal: '#FBBF24',
          hot: '#EF4444',
        },
        // Humidity colors
        humid: {
          dry: '#E0F2FE',
          normal: '#7DD3FC',
          wet: '#0EA5E9',
        },
        // Light colors
        light: {
          dark: '#334155',
          medium: '#FDE047',
          bright: '#FACC15',
        },
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        'heat-wave': 'linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(251, 146, 60, 0.3))',
      },
      backdropBlur: {
        glass: '10px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'deep': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'glow-blue': '0 0 20px rgba(96, 165, 250, 0.5)',
        'glow-yellow': '0 0 20px rgba(251, 191, 36, 0.5)',
        'glow-red': '0 0 30px rgba(239, 68, 68, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'heat-wave': 'heat-wave 2s ease-in-out infinite',
        'counter': 'counter 0.5s ease-out',
        'fog': 'fog 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'heat-wave': {
          '0%, 100%': { transform: 'skewX(0deg) skewY(0deg)' },
          '25%': { transform: 'skewX(1deg) skewY(0.5deg)' },
          '50%': { transform: 'skewX(-1deg) skewY(-0.5deg)' },
          '75%': { transform: 'skewX(0.5deg) skewY(-0.5deg)' },
        },
        counter: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fog: {
          '0%, 100%': { opacity: '0.3', transform: 'translateX(0) translateY(0)' },
          '50%': { opacity: '0.5', transform: 'translateX(10px) translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
