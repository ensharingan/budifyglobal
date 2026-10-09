import type { Config } from 'tailwindcss';

// Colours are CSS variables (see globals.css) so contrast can be tuned in one place.
// All pairings used for text meet WCAG 2.2 AA (4.5:1) – see docs/ACCESSIBILITY.md.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: 'rgb(var(--brand) / <alpha-value>)', dark: 'rgb(var(--brand-dark) / <alpha-value>)', soft: 'rgb(var(--brand-soft) / <alpha-value>)' },
        ink: { DEFAULT: 'rgb(var(--ink) / <alpha-value>)', muted: 'rgb(var(--ink-muted) / <alpha-value>)' },
        surface: { DEFAULT: 'rgb(var(--surface) / <alpha-value>)', alt: 'rgb(var(--surface-alt) / <alpha-value>)' },
        line: 'rgb(var(--line) / <alpha-value>)',
        warn: { DEFAULT: 'rgb(var(--warn) / <alpha-value>)', soft: 'rgb(var(--warn-soft) / <alpha-value>)' }
      },
      fontFamily: {
        sans: ['"Inter Variable"', '"Noto Sans Thai"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      maxWidth: { page: '72rem' }
    }
  },
  plugins: []
};
export default config;
