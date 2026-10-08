/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#3385d6',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
        },
        success: {
          50: '#eafaf0',
          500: '#28a745',
          600: '#1e7e34',
        },
        warning: {
          50: '#fff9e6',
          500: '#ffc107',
          600: '#cc9a06',
        },
        danger: {
          50: '#fdecee',
          500: '#dc3545',
          600: '#b02a37',
        },
        orange: {
          500: '#ff9800',
        },
        surface: '#ffffff',
        canvas: '#f9fafb',
        border: '#e5e7eb',
        muted: '#6b7280',
        ink: '#111827',
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        chip: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
}
