// ============================================================
// THEME SWITCHER
// Uncomment ONE theme block below. Comment out all others.
// Only ONE theme should be active at a time.
//
// After switching: restart the dev server (npm run dev)
// to apply Tailwind changes.
// ============================================================

// --------------------------------------------------
// THEME 1: "Original" (Blue/Gray Corporate)
// --------------------------------------------------
// export const theme = {
//   name: 'Original',
//   colors: {
//     primary: '#1f2937',
//     'primary-light': '#374151',
//     accent: '#3b82f6',
//     'accent-dark': '#1d4ed8',
//     success: '#10b981',
//     error: '#ef4444',
//     warning: '#f59e0b',
//     background: '#f9fafb',
//     surface: '#ffffff',
//     border: '#e5e7eb',
//     'neutral-text': '#6b7280',
//   },
//   gradients: {
//     hero: 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
//     heroText: 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
//     subtle: 'linear-gradient(to right, #f9fafb, #eff6ff)',
//     success: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
//     card: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
//   },
// };

// --------------------------------------------------
// THEME 2: "Energetic Minimalism" (Soft Neons & Bold Pops)
// --------------------------------------------------
// export const theme = {
//   name: 'Energetic Minimalism',
//   colors: {
//     primary: '#3D3D3D',
//     'primary-light': '#757575',
//     accent: '#FF4081',
//     'accent-dark': '#E91E63',
//     success: '#00C853',
//     error: '#FF1744',
//     warning: '#FFD600',
//     background: '#F5F5F5',
//     surface: '#FFFFFF',
//     border: '#E0E0E0',
//     'neutral-text': '#616161',
//   },
//   gradients: {
//     hero: 'linear-gradient(135deg, #FF4081 0%, #FF80AB 100%)',
//     heroText: 'linear-gradient(135deg, #3D3D3D 0%, #FF4081 100%)',
//     subtle: 'linear-gradient(to right, #F5F5F5, #FFF0F5)',
//     success: 'linear-gradient(135deg, #00C853 0%, #76FF03 100%)',
//     card: 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
//   },
// };

// --------------------------------------------------
// THEME 3: "Soft Citrus" (Warm & Confident)
// --------------------------------------------------
export const theme = {
  name: 'Soft Citrus',
  colors: {
    primary: '#4A4A4A',
    'primary-light': '#8C8C8C',
    accent: '#FF6D00',
    'accent-dark': '#E65100',
    success: '#16A34A',
    'success-light': '#BBF7D0',
    error: '#DC2626',
    'error-light': '#FEE2E2',
    warning: '#F59E0B',
    'warning-light': '#FEF3C7',
    info: '#2563EB',
    'info-light': '#DBEAFE',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#F0F0F0',
    'neutral-text': '#757575',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #FF6D00 0%, #FFAB40 100%)',
    heroText: 'linear-gradient(135deg, #4A4A4A 0%, #FF6D00 100%)',
    subtle: 'linear-gradient(to right, #FAFAFA, #FFF8E1)',
    success: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
    info: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    card: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
    saffron: 'linear-gradient(135deg, #FF9933 0%, #FF6D00 100%)',
    tricolor: 'linear-gradient(180deg, #FF9933 0%, #FFFFFF 40%, #FFFFFF 60%, #138808 100%)',
  },
};

export type Theme = typeof theme;
