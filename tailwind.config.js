/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f7',
          100: '#d5dce9',
          200: '#abb9d3',
          300: '#8196bc',
          400: '#5773a6',
          500: '#2d5090',
          600: '#243f72',
          700: '#1B2A4A',   // Ink Navy — primary
          800: '#152239',
          900: '#0e1a2d',
          950: '#070e1a',
        },
        brass: {
          50:  '#fdf9ee',
          100: '#f8efd0',
          200: '#f0dda0',
          300: '#e8cb6f',
          400: '#dfb83e',
          500: '#B8943F',   // Brass Gold — accent
          600: '#9a7a32',
          700: '#7c6028',
          800: '#5e481e',
          900: '#403114',
          950: '#201808',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0D9488',   // Status: In Progress
        },
        sage: {
          500: '#7cb894',
          600: '#6B9C78',   // Status: Completed
        },
        brick: {
          500: '#d97706',
          600: '#B45309',   // Priority: High / Status: Rejected
        },
        amber: {
          500: '#F59E0B',   // Status: Pending
          600: '#D97706',   // Priority: Medium
        },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'ledger': '4px 0 0 0 #B8943F',
        'card':   '0 4px 24px -4px rgba(27,42,74,0.18)',
        'card-hover': '0 8px 40px -6px rgba(27,42,74,0.28)',
        'glow-gold': '0 0 24px rgba(184,148,63,0.35)',
        'glow-navy': '0 0 32px rgba(27,42,74,0.4)',
      },
      backgroundImage: {
        'ledger-pattern': "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(184,148,63,0.07) 24px)",
        'hero-gradient':  'linear-gradient(135deg, #0e1a2d 0%, #1B2A4A 50%, #243f72 100%)',
        'gold-gradient':  'linear-gradient(135deg, #B8943F 0%, #dfb83e 50%, #B8943F 100%)',
        'card-gradient':  'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-gold':    'pulseGold 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseGold:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        float:       { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      borderRadius: {
        'xl2': '1rem',
        '2xl': '1.25rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};
