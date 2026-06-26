/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#eeeae4',
          300: '#e3ddd5',
          400: '#d3ccc1',
          DEFAULT: '#eeeae4',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#3d3d3d',
          muted: '#6b6b6b',
          faint: '#9b9b9b',
        },
      },
      fontFamily: {
        sans: ['"Mona Sans"', '"Mona Sans Variable"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 5.5vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.3rem, 2.8vw, 2.2rem)', { lineHeight: '1.38', letterSpacing: '-0.02em' }],
        'nav': ['15px', { lineHeight: '1.5' }],
        'nav-lg': ['17px', { lineHeight: '1.5' }],
        'card-title': ['1.65rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      spacing: {
        'nav-offset': '68px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
