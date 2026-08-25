---
name: Citizen Services Department
colors:
  surface: '#faf9fc'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f6'
  surface-container: '#eeedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#456085'
  primary: '#000b1d'
  on-primary: '#ffffff'
  primary-container: '#002244'
  on-primary-container: '#708ab2'
  inverse-primary: '#adc8f3'
  secondary: '#115cb9'
  on-secondary: '#ffffff'
  secondary-container: '#659dfe'
  on-secondary-container: '#003370'
  tertiary: '#070b0e'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d2225'
  on-tertiary-container: '#84898d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#adc8f3'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2d486c'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#acc7ff'
  on-secondary-fixed: '#001a40'
  on-secondary-fixed-variant: '#004491'
  tertiary-fixed: '#dfe3e7'
  tertiary-fixed-dim: '#c2c7cb'
  on-tertiary-fixed: '#171c20'
  on-tertiary-fixed-variant: '#42474b'
  background: '#faf9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e5'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  margin-mobile: 16px
  margin-desktop: 40px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style
The design system is rooted in the principles of **Institutional Minimalism**. It prioritizes clarity, accessibility, and the quiet authority of government service. The visual narrative balances the precision of modern administrative tools with the historical weight of public office.

The style avoids ephemeral trends in favor of a "permanent" aesthetic. It utilizes a structured grid, high-contrast ratios, and a complete absence of decorative effects like blurs or gradients. The emotional response is one of stability, competence, and transparency, ensuring that citizens of all technical literacies can navigate services without friction.

## Colors
The palette is strictly controlled to ensure WCAG 2.1 AA compliance across all interfaces. The primary color, a deep navy, is reserved for high-level navigation, primary actions, and institutional branding. The secondary blue is used for interactive elements such as links and secondary buttons.

Backgrounds remain primarily white to maximize legibility, with light gray surfaces used sparingly to denote different functional zones or sidebar content. Functional colors for error and success states are chosen for high visibility against the light background.

## Typography
Typography is the primary vehicle for the design system's identity. **EB Garamond** is used for page titles and section headings to establish a sense of history and trust. It should be used with generous leading to maintain its classical elegance.

**Inter** handles all functional UI, body text, and data-heavy tables. It provides the necessary clarity for long-form instructional content. For labels and captions, Inter is often set in a slightly heavier weight or with increased letter-spacing to ensure distinct hierarchy from body text.

## Layout & Spacing
The layout follows a 12-column fixed grid for desktop, centering the content with a maximum width of 1280px. For mobile devices, the system transitions to a 4-column fluid layout.

Spacing is based on a 4px baseline grid to ensure mathematical consistency. We prioritize "breathability" in the layout; large margins between sections prevent information overload, which is critical for government services that often involve complex data or instructions. Every component uses standardized padding to maintain a predictable rhythm across the entire platform.

## Elevation & Depth
In keeping with the institutional and flat nature of the design system, depth is achieved through **Tonal Layering** and **Standardized Outlines** rather than shadows.

- **Level 0 (Base):** The main canvas background (`#ffffff`).
- **Level 1 (Surfaces):** Cards and sidebars use a 1px solid border (`#d1d1d1`) or a subtle gray fill (`#f0f0f0`).
- **Level 2 (Interaction):** Hover states for interactive elements use a slight tonal shift (darker or lighter fill) rather than an increase in shadow depth.

The absence of shadows ensures that the interface remains crisp and legible, avoiding the "floaty" feel of consumer-grade SaaS products.

## Shapes
The design system employs a **Sharp (0)** roundedness strategy. Every element—buttons, input fields, cards, and banners—features 90-degree corners. This geometric precision reinforces the institutional nature of the brand, suggesting structure, rigidity, and reliability. There are no rounded corners in this system, ensuring a cohesive and disciplined visual language.

## Components

### Buttons
Buttons are rectangular with sharp edges. Primary buttons use the deep navy background with white text. Secondary buttons use a 2px navy border with navy text. The "Focus" state is critical: a 3px offset "Gold" or "High-Contrast Blue" outline must appear on keyboard focus to meet accessibility standards.

### Input Fields
Fields utilize a 1px solid border in dark gray. Labels are always positioned above the input, never as placeholders, to ensure accessibility. Error states change the border to a 2px solid red with an accompanying error icon and text below the field.

### Cards
Cards are defined by a 1px neutral border. They do not use shadows. They are used to group related information or as entry points to specific services. Headers within cards should use a smaller serif font to maintain the institutional hierarchy.

### Status Indicators / Chips
Used for application statuses (e.g., "Pending," "Approved"). They use high-contrast text on a light tinted background. Because corners are sharp, these look like small rectangular tags rather than rounded pills.

### Government Emblem Placeholder
The top-left of the global header is reserved for the Department Emblem. It should be flanked by the "Citizen Services Department" name in Inter Bold, ensuring the institutional identity is the first thing a user sees.