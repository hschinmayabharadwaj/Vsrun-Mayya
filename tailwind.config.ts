import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        'primary-light': '#374151',
        accent: '#3b82f6',
        'accent-dark': '#1d4ed8',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        'neutral-bg': '#f9fafb',
        'neutral-border': '#e5e7eb',
        'neutral-text': '#6b7280',
      },
      spacing: {
        '44px': '44px',
      },
      minHeight: {
        '44px': '44px',
      },
      minWidth: {
        '44px': '44px',
      },
    },
  },
  plugins: [],
};

export default config;
