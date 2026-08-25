import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PrototypeBanner } from '@/components/PrototypeBanner';
import { PortalChrome } from '@/components/PortalChrome';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Citizen Services Portal — National Portal of India (Demo)',
  description:
    'Access citizen services, track applications, helplines, and grievance redressal. Prototype demonstration portal.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-white text-on-surface font-body">
        <PrototypeBanner />
        <PortalChrome>{children}</PortalChrome>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
