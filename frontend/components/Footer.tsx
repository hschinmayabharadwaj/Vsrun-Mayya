import Link from 'next/link';
import { getFooterLinks, getPortalConfig } from '@/lib/portal-api';

export async function Footer() {
  let links: { label: string; href: string }[] = [];
  let config = null;

  try {
    [links, config] = await Promise.all([getFooterLinks(), getPortalConfig()]);
  } catch {
    return (
      <footer className="mt-auto border-t border-neutral-200 bg-neutral-100 py-4 text-center text-body-sm text-on-surface-variant">
        Citizen Services Portal — Demo
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-neutral-300 bg-neutral-100">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-semibold text-on-surface mb-2">{config.siteName}</p>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {config.department}. {config.prototypeNotice}
            </p>
          </div>
          <div>
            <p className="font-semibold text-on-surface mb-2">Quick Links</p>
            <nav className="grid grid-cols-2 gap-1" aria-label="Footer navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-gov-link hover:underline py-1 min-h-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-neutral-300 flex flex-col sm:flex-row justify-between gap-2 text-label-sm text-on-surface-variant">
          <p>© {new Date().getFullYear()} {config.siteName}. All rights reserved.</p>
          <p>
            Helpline: {config.contact.tollFree} | {config.contact.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
