module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'aurora': 'aurora 6s ease infinite',
        'aurora-blur': 'aurora-blur 8s ease infinite',
        'bounce-once': 'bounceOnce 0.5s ease-in-out',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'fadeIn': 'fadeIn 1s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'aurora-blur': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.5' },
          '33%': { transform: 'translate(-10px, 5px)', opacity: '0.7' },
          '66%': { transform: 'translate(10px, -5px)', opacity: '0.6' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'rotate(45deg) translateY(0)' },
          '50%': { transform: 'rotate(45deg) translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        'bounce-soft': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      colors: {
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
        },
      },
    },
  },
  plugins: [],
} 