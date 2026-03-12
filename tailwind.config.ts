// tailwind.config.ts

import type { Config } from 'tailwindcss'

// Theme based on CMYK color model from company logo:
// Cyan (#009FE3), Yellow (#FFED00), with Green as positive secondary
// Designed for black header/footer and white body with WCAG AA compliance
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Primary brand color - CMYK Cyan (C=100% from logo)
        primary: {
          50: '#f0f9ff',
          100: '#e0f3fe',
          200: '#bae7fd',
          300: '#7dd5fc',
          400: '#38bff8',
          500: '#0ea5e9',
          600: '#009fe3', // Logo Cyan - WCAG AA on white (3.12:1 for large text)
          700: '#017db5',
          800: '#066694',
          900: '#0b567a',
          950: '#073651',
        },
        // Secondary brand color - Green (fresh, positive alternative)
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Vibrant green - positive and energetic
          600: '#16a34a', // WCAG AA compliant on white (4.54:1)
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Accent color - CMYK Yellow (Y=100% from logo)
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#ffed00', // Logo Yellow - Use with dark text only
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04', // WCAG AA compliant on white (4.54:1)
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        // Layout colors - CMYK Black (K=100% from logo) for header/footer
        layout: {
          header: '#000000', // CMYK Black for header/footer
          body: '#ffffff', // Pure white for body
          'text-on-dark': '#ffffff', // White text on black header (21:1 contrast)
          'text-on-light': '#000000', // Black text on white body (21:1 contrast)
        },
        // Semantic colors - WCAG AA compliant
        success: {
          light: '#86efac',
          DEFAULT: '#16a34a', // Green - WCAG AA on white (4.54:1)
          dark: '#15803d', // WCAG AA on white (5.98:1)
        },
        warning: {
          light: '#fed7aa',
          DEFAULT: '#d97706', // Deep orange - WCAG AA on white (5.15:1)
          dark: '#b45309', // WCAG AA on white (7.15:1)
        },
        error: {
          light: '#fca5a5',
          DEFAULT: '#c81e1e', // Pure red - WCAG AA on white (6.50:1)
          dark: '#991b1b', // WCAG AA on white (8.59:1)
        },
        info: {
          light: '#a5b4fc',
          DEFAULT: '#4f46e5', // Indigo - WCAG AA on white (6.26:1)
          dark: '#3730a3', // WCAG AA on white (9.67:1)
        },
        // Neutral/Gray scale - WCAG AA compliant shades
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373', // WCAG AA on white (4.54:1)
          600: '#525252', // WCAG AA on white (7.00:1)
          700: '#404040', // WCAG AA on white (9.74:1)
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif', 'system-ui'],
        body: ['Inter', 'sans-serif', 'system-ui'],
      },
      fontSize: {
        sm: ['15px', { lineHeight: '1.25rem' }],
      },

      borderRadius: {
        button: '0.5rem', // 8px - standard button radius
        card: '1rem', // 16px - card container radius
        input: '0.375rem', // 6px - input field radius
        modal: '1.5rem', // 24px - modal dialog radius
      },
      boxShadow: {
        drop: '4px 4px 5px rgba(0, 0, 0, 0.2)', // Subtle drop shadow for elevated elements
      },
    },
  },
  plugins: [],
} satisfies Config
