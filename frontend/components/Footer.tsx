import Link from 'next/link';
import { getFooterLinks, getPortalConfig } from '@/lib/portal-api';
import { Icon } from '@/components/Icon';

export async function Footer() {
  let links: { label: string; href: string }[] = [];
  let config = null;

  try {
    [links, config] = await Promise.all([getFooterLinks(), getPortalConfig()]);
  } catch {
    return (
      <footer className="mt-auto border-t border-outline-variant bg-neutral-50 py-6 text-center text-body-sm text-on-surface-variant">
        Citizen Services Portal — Demo
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-outline-variant bg-[#edf3f9]">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="Portal Logo" className="w-10 h-10 rounded-lg" />
              <div>
                <p className="font-bold text-on-surface">{config.siteName}</p>
                <p className="text-label-sm text-on-surface-variant">{config.siteTagline}</p>
              </div>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed max-w-md">
              {config.department}. {config.prototypeNotice}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-label-sm font-semibold text-[#123A63] shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Designed and built with Codex
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                <Icon name="phone" size={16} className="text-secondary" />
                {config.contact.tollFree}
              </div>
              <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                <Icon name="email" size={16} className="text-secondary" />
                {config.contact.email}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-semibold text-on-surface mb-3 text-body-sm">Quick Links</p>
            <nav className="grid grid-cols-1 gap-1.5" aria-label="Footer navigation">
              {links.slice(0, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors py-1 min-h-0 flex items-center gap-1"
                >
                  <Icon name="chevron_right" size={14} className="text-outline" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <p className="font-semibold text-on-surface mb-3 text-body-sm">Services</p>
            <nav className="grid grid-cols-1 gap-1.5" aria-label="Footer services">
              {[
                { href: '/services', label: 'All Services' },
                { href: '/track', label: 'Track Application' },
                { href: '/grievance', label: 'File Grievance' },
                { href: '/helpline', label: 'Helpline' },
                { href: '/help', label: 'Help Center' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-on-surface-variant hover:text-secondary transition-colors py-1 min-h-0 flex items-center gap-1"
                >
                  <Icon name="chevron_right" size={14} className="text-outline" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-3 text-label-sm text-on-surface-variant">
          <p>&copy; {new Date().getFullYear()} {config.siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-secondary transition-colors min-h-0">Privacy</Link>
            <Link href="/terms" className="hover:text-secondary transition-colors min-h-0">Terms</Link>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/indian-flag.svg" alt="Indian Flag" className="h-4 rounded-sm" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/digital-india.svg" alt="Digital India" className="h-8 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
}
