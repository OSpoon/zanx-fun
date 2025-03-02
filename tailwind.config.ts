import type { Config } from 'tailwindcss'

export default {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#60A5FA',
          light: '#3B82F6',
          dark: '#2563EB'
        },
        secondary: {
          DEFAULT: '#34D399',
          light: '#10B981',
          dark: '#059669'
        },
        dark: {
          DEFAULT: '#111827',
          light: '#1F2937',
          lighter: '#374151'
        },
        light: {
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
          darker: '#D1D5DB'
        },
        glass: {
          dark: 'rgba(17, 24, 39, 0.7)',
          light: 'rgba(255, 255, 255, 0.8)'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} satisfies Config 