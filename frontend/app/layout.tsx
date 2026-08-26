import type { Metadata, Viewport } from 'next';
import { outfit } from '@/lib/fonts';
import './globals.css';
import { PrototypeBanner } from '@/components/PrototypeBanner';
import { PortalChrome } from '@/components/PortalChrome';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'Citizen Services Portal — National Portal of India (Demo)',
  description:
    'Access citizen services, track applications, helplines, and grievance redressal. Prototype demonstration portal.',
  icons: { icon: '/logo.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-background text-on-surface font-body">
        <SmoothScrollProvider>
          <PrototypeBanner />
          <PortalChrome>{children}</PortalChrome>
          <Footer />
          <CookieConsent />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
