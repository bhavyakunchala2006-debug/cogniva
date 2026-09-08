import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cogniva Design System
        background: '#FFFDF7',
        primary: {
          DEFAULT: '#4F7CAC',
          50: '#EBF2F9',
          100: '#C4D9EE',
          200: '#9DC0E3',
          300: '#76A7D8',
          400: '#4F7CAC',
          500: '#3D6190',
          600: '#2B4674',
          700: '#1A2B58',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#70B77E',
          50: '#EBF7ED',
          100: '#C4E7CB',
          200: '#9DD7A9',
          300: '#76C787',
          400: '#70B77E',
          500: '#559761',
          600: '#3A7744',
          700: '#1F5727',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F4B860',
          50: '#FEF5E7',
          100: '#FBE4B6',
          200: '#F8D385',
          300: '#F6C254',
          400: '#F4B860',
          500: '#E09B2E',
          600: '#B87E1C',
          700: '#90610A',
          foreground: '#1C1C1E',
        },
        highlight: {
          DEFAULT: '#F28C8C',
          50: '#FDECEC',
          100: '#F9C9C9',
          200: '#F5A6A6',
          300: '#F28C8C',
          400: '#E86060',
          500: '#C93434',
          600: '#A00808',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C1C1E',
        },
        muted: {
          DEFAULT: '#F5F0E8',
          foreground: '#6B6B6B',
        },
        border: '#E8E0D0',
        ring: '#4F7CAC',
        destructive: {
          DEFAULT: '#F28C8C',
          foreground: '#FFFFFF',
        },
        // Text
        foreground: '#1C1C1E',
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C1C1E',
        },
        input: '#E8E0D0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '700' }],
        'section-title': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'card-title': ['1.375rem', { lineHeight: '1.875rem', fontWeight: '600' }],
        'body-lg': ['1.25rem', { lineHeight: '1.875rem', fontWeight: '400' }],
        'body': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'btn': ['1.25rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'caption': ['0.9375rem', { lineHeight: '1.4rem', fontWeight: '400' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        'touch': '3rem', // 48px minimum touch target
        'touch-lg': '3.5rem', // 56px preferred
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(79,124,172,0.08)',
        'card-hover': '0 8px 24px 0 rgba(79,124,172,0.15)',
        'btn': '0 4px 12px 0 rgba(79,124,172,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [animate],
}

export default config
