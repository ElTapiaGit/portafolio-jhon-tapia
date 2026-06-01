/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx}',
  ],
  theme: {
    /* ── Control de pantalla ── */
    container: {
      center: true, 
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px', 
      },
    },
    extend: {
      /* ── Sistema de Colores Dinamicos (lee desde stile.css── */
      colors: {
        dark: {
          DEFAULT: 'var(--color-dark)',
          800: 'var(--color-dark-800)',
          700: 'var(--color-dark-700)',
          600: 'var(--color-dark-600)',
          500: 'var(--color-dark-500)',
          400: 'var(--color-dark-400)',
          300: 'var(--color-dark-300)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          dim: 'var(--color-primary-dim)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dim: 'var(--color-accent-dim)',
        },
        text: {
          bright: 'var(--text-bright)',
          base: 'var(--text-base)',
          muted: 'var(--text-muted)',
        }
      },

      /* ── Tipografias ─── */
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        heading: ['var(--font-heading)'],
      },

      /* ── Extenciones de utilidades ── */
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px para metadatos
      },
    },
  },
  plugins: [],
}
