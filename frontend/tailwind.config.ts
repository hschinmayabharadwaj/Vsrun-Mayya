import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gov-red': '#a6192e',
        'gov-red-dark': '#8b1426',
        'gov-link': '#004b87',
        error: '#dc2626',
        'error-container': '#fef2f2',
        background: '#ffffff',
        surface: '#ffffff',
        'on-background': '#1a1a1a',
        'on-surface': '#1a1a1a',
        'on-surface-variant': '#4a4a4a',
        primary: '#1a1a1a',
        secondary: '#004b87',
        outline: '#cccccc',
        'outline-variant': '#e5e5e5',
        success: '#2e7d32',
      },
      fontFamily: {
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        'label-md': ['14px', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        md: '16px',
        lg: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '32px',
      },
      maxWidth: {
        'container-max': '1200px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
