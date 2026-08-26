import type { Config } from 'tailwindcss';
import { theme } from './lib/theme';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        'primary-light': theme.colors['primary-light'],
        secondary: theme.colors.accent,
        'secondary-hover': theme.colors['accent-dark'],
        accent: theme.colors.accent,
        'accent-dark': theme.colors['accent-dark'],
        success: theme.colors.success,
        'success-light': theme.colors['success-light'],
        error: theme.colors.error,
        'error-light': theme.colors['error-light'],
        warning: theme.colors.warning,
        'warning-light': theme.colors['warning-light'],
        info: theme.colors.info,
        'info-light': theme.colors['info-light'],
        background: theme.colors.background,
        surface: theme.colors.surface,
        'on-background': '#1a1a1a',
        'on-surface': '#1a1a1a',
        'on-surface-variant': '#64748b',
        outline: '#cbd5e1',
        'outline-variant': '#e2e8f0',
        'neutral-50': theme.colors.background,
        'neutral-100': '#f1f5f9',
        'neutral-200': '#e2e8f0',
        'neutral-300': '#cbd5e1',
        'gov-red': theme.colors.primary,
        'gov-red-dark': theme.colors['primary-light'],
        'gov-link': theme.colors.accent,
        'error-container': '#fef2f2',
      },
      fontFamily: {
        body: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-lg': ['2.25rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-lg': ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
        'headline-md': ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-md': ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        'margin-mobile': '8px',
        'margin-desktop': '12px',
      },
      maxWidth: {
        'container-max': '1400px',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'glow': `0 0 20px ${theme.colors.accent}25`,
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-up-delay-1': 'slideUp 0.5s ease-out 0.1s both',
        'slide-up-delay-2': 'slideUp 0.5s ease-out 0.2s both',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseRing: {
          '0%': { boxShadow: `0 0 0 0 ${theme.colors.accent}66` },
          '100%': { boxShadow: `0 0 0 12px ${theme.colors.accent}00` },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
