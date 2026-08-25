'use client';

import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Public Service Platform - Demo',
  description: 'A prototype platform for public digital services',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-bg">
        <div className="flex flex-col min-h-screen">
          {/* Prototype disclaimer banner */}
          <div className="sticky top-0 z-50 w-full bg-warning/10 border-b-2 border-warning text-warning px-4 py-2 text-sm font-medium text-center">
            ⚠️ Prototype / Demo — This is not an official Government platform
          </div>

          {/* Main content */}
          <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 md:py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="w-full bg-primary text-white px-4 py-6 mt-12 border-t-2 border-primary-light">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-300">
                This is a demonstration platform designed for the Public Service
                Hackathon.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                For support, contact the platform admin.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
