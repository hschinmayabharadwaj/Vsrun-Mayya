// ============================================================
// IMAGE ASSETS
// All images sourced from Unsplash/Pexels (free-use, high quality)
// Related to government, citizens, and public services.
// ============================================================

export const IMAGES = {
  // Hero & Landing
  hero: {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80',
    alt: 'Professional handshake representing government-citizen partnership',
    width: 1920,
    height: 1080,
  },
  heroFallback: {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
    alt: 'Modern office workspace',
    width: 1920,
    height: 1080,
  },

  // Service Categories
  services: {
    identity: {
      src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
      alt: 'Identity verification process',
    },
    education: {
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
      alt: 'Students in educational environment',
    },
    health: {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
      alt: 'Healthcare services',
    },
    business: {
      src: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
      alt: 'Business and trade environment',
    },
    housing: {
      src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
      alt: 'Housing and property services',
    },
    welfare: {
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
      alt: 'Community welfare programs',
    },
  },

  // Dashboard & Status
  dashboard: {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    alt: 'Data dashboard overview',
  },
  success: {
    src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80',
    alt: 'Successful completion concept',
  },

  // Trust & Government
  government: {
    src: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80',
    alt: 'Government building representing public service',
  },
  trust: {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    alt: 'Trust and reliability',
  },

  // Empty & Error States
  emptyState: {
    src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80',
    alt: 'No data available',
  },

  // Default Avatar
  avatar: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    alt: 'Default user avatar',
  },
} as const;

// Utility to get image with fallback
export function getImageWithFallback(
  imageKey: keyof typeof IMAGES,
  fallbackKey?: keyof typeof IMAGES
) {
  const primary = IMAGES[imageKey];
  const fallback = fallbackKey ? IMAGES[fallbackKey] : IMAGES.heroFallback;
  return { primary, fallback };
}
