import localFont from 'next/font/local';

export const outfit = localFont({
  src: [
    {
      path: '../public/fonts/Outfit-Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-outfit',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const TYPE_SCALE = {
  'display-xl': {
    fontSize: '3rem',
    lineHeight: '1.1',
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: '-0.02em',
  },
  'display-lg': {
    fontSize: '2.25rem',
    lineHeight: '1.15',
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: '-0.02em',
  },
  'headline-lg': {
    fontSize: '1.75rem',
    lineHeight: '1.25',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  'headline-md': {
    fontSize: '1.25rem',
    lineHeight: '1.35',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  'body-lg': {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    fontWeight: FONT_WEIGHTS.regular,
  },
  'body-md': {
    fontSize: '1rem',
    lineHeight: '1.6',
    fontWeight: FONT_WEIGHTS.regular,
  },
  'body-sm': {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    fontWeight: FONT_WEIGHTS.regular,
  },
  'label-lg': {
    fontSize: '0.875rem',
    lineHeight: '1',
    letterSpacing: '0.02em',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  'label-md': {
    fontSize: '0.8125rem',
    lineHeight: '1.2',
    letterSpacing: '0.02em',
    fontWeight: FONT_WEIGHTS.medium,
  },
  'label-sm': {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: FONT_WEIGHTS.medium,
  },
} as const;
