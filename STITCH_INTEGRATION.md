# Stitch Integration Guide

This document explains how to export screens from Google Stitch and implement them in this Next.js project.

## Overview

The project is designed to accept Stitch-generated screens with minimal friction. Stitch provides:
- **Component code** - Ready-to-use React components
- **Design tokens** - Colors, typography, spacing
- **Visual mockups** - Screenshots for reference

## Step-by-Step Integration Process

### 1. Export from Stitch

1. Open the Stitch project: https://stitch.withgoogle.com/projects/6350800458773147763
2. Select a screen you want to implement
3. Click "Export" or "Get Code"
4. Choose **React/TypeScript** as the output format
5. Stitch will provide:
   - `screen.tsx` - Component code
   - `screen.module.css` - Component styles (if using CSS modules)
   - `tokens.ts` - Design tokens (colors, spacing, etc.)

### 2. Directory Structure

Place exported components in the correct directory:

```
components/
├── screens/
│   ├── [ScreenName].tsx         # Exported Stitch component
│   ├── [ScreenName].module.css  # Component-specific styles
│   └── ...
├── ui/
│   ├── Button.tsx               # Shared UI components
│   ├── Input.tsx
│   └── ...
└── layout/
    ├── Header.tsx
    ├── Footer.tsx
    └── ...
```

### 3. Creating the Route

For each Stitch screen, create a corresponding route in the app directory:

```typescript
// app/screens/[screenName]/page.tsx
'use client';

import ScreenComponent from '@/components/screens/[ScreenName]';

export default function ScreenPage() {
  return <ScreenComponent />;
}
```

### 4. Adapting Stitch Code for Next.js

#### Challenge: Stitch exports standalone React components
**Solution:** Integrate with Next.js App Router patterns

#### Example Conversion:

**From Stitch (class-based or standalone):**
```jsx
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  // ...
  return <div>...</div>;
}
```

**To Next.js (with Server Components):**
```jsx
'use client'; // Add if using client-side state

export default function LoginPage() {
  return <LoginScreen />;
}
```

### 5. Respecting Design Tokens

Stitch exports design tokens. Map them to Tailwind classes or CSS variables:

**Stitch tokens (example):**
```typescript
export const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
};
```

**Implementation in Tailwind:**
```typescript
// tailwind.config.ts
theme: {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
  },
}
```

### 6. Mobile-First Considerations

Stitch designs are mobile-first by default. Ensure:
- All tap targets are ≥44×44px (built into Tailwind with `min-h-44px`, `min-w-44px`)
- No hover-dependent interactions
- Responsive breakpoints follow `md:` (768px) pattern

### 7. Accessibility Compliance

Verify every imported Stitch component:
- ✅ Semantic HTML (`<button>`, `<form>`, `<label>`)
- ✅ ARIA labels for icons and complex elements
- ✅ Color + text (never color-only status indicators)
- ✅ Focus visible styles (already in `app/globals.css`)
- ✅ Keyboard navigation works end-to-end

### 8. Testing Stitch Components

After integrating a Stitch screen:

```bash
# 1. Run development server
npm run dev

# 2. Test on mobile (Chrome DevTools)
# - DevTools → F12 → Toggle device toolbar (Ctrl+Shift+M)
# - Test at 360px width (thumb zone)
# - Test on Slow 3G throttle

# 3. Test keyboard navigation
# - Tab through all interactive elements
# - Ensure focus is visible
# - Test arrow keys, Enter, Escape

# 4. Test with screen reader
# - NVDA (Windows), VoiceOver (Mac), or browser built-in
# - All text content should be readable
# - Form labels should be associated with inputs

# 5. Type check
npm run type-check
```

## Example: Integrating a "Home" Screen from Stitch

### Stitch provides:

**components/screens/Home.tsx**
```jsx
export default function HomeScreen() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <button onClick={() => {}}>Start</button>
    </div>
  );
}
```

### Create route:

**app/home/page.tsx**
```jsx
'use client';

import HomeScreen from '@/components/screens/Home';

export default function HomePage() {
  return <HomeScreen />;
}
```

### Navigate from index:

**app/page.tsx**
```jsx
import Link from 'next/link';

export default function IndexPage() {
  return (
    <Link href="/home">
      <button>Go to Home</button>
    </Link>
  );
}
```

## Handling Stitch-Generated Images

Stitch may export images (icons, illustrations). Place them in `public/`:

```
public/
├── icons/
│   ├── home.svg
│   ├── status.svg
│   └── ...
└── illustrations/
    ├── empty-state.svg
    └── ...
```

Use in components:

```jsx
import Image from 'next/image';

export default function Component() {
  return (
    <Image
      src="/icons/home.svg"
      alt="Home icon"
      width={24}
      height={24}
    />
  );
}
```

## Compliance with Hackathon Playbook

### Checklist for Stitch Screens:

- [ ] Screen is 360–400px mobile-first design
- [ ] All CTA buttons are in thumb zone (bottom third)
- [ ] Minimum 44×44px tap targets
- [ ] Plain language labels (no jargon)
- [ ] Loading state shown (not blank spinner)
- [ ] Error state with actionable message
- [ ] 4.5:1 contrast ratio on text
- [ ] No color-only status indicators
- [ ] Keyboard navigation complete
- [ ] Screen reader friendly

## Troubleshooting

### Issue: Stitch component styles conflict with Tailwind
**Solution:** Use CSS modules (`.module.css`) for Stitch component-specific styles, keep global styles in `globals.css`

### Issue: Stitch component expects props but we're using mock data
**Solution:** Create a wrapper component that connects Stitch UI to mock data:

```jsx
// components/screens/StatusWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import StatusUI from './Status'; // Stitch component

export default function StatusPage() {
  const [applications, setApplications] = useState([]);
  
  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => setApplications(data.data));
  }, []);

  return <StatusUI applications={applications} />;
}
```

### Issue: Stitch component has real API calls
**Solution:** Extract the UI logic, replace API calls with mock data fetching from `/lib/mock-data.ts`

## Performance Tips

- Use `next/dynamic` for heavy Stitch components:
  ```jsx
  const StitchComponent = dynamic(() => import('@/components/screens/Heavy'), {
    loading: () => <div>Loading...</div>,
  });
  ```

- Lazy-load images exported from Stitch:
  ```jsx
  <Image
    src="/image.webp"
    alt="..."
    loading="lazy"
  />
  ```

- Tree-shake unused Stitch components (don't import if not used)

## Next Steps

1. **Export first screen** from Stitch (e.g., "Login" or "Home")
2. **Create `components/screens/` directory**
3. **Place exported files** in the directory
4. **Create a route** to test it (`app/screens/[name]/page.tsx`)
5. **Run `npm run dev`** and verify at `http://localhost:3000/screens/[name]`
6. **Test accessibility** (keyboard, screen reader, mobile)
7. **Iterate** - import more Stitch screens as needed

---

For questions about Stitch exports, refer to: https://stitch.withgoogle.com/docs
