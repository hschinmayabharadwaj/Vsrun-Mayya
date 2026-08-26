import { Header } from '@/components/Header';
import { DirectoryNavClient } from '@/components/DirectoryNavClient';
import { getDirectoryNav, getNotices, getPortalConfig, type PortalConfig } from '@/lib/portal-api';

const FALLBACK_CONFIG: PortalConfig = {
  siteName: 'Citizen Services Portal',
  siteTagline: 'National Portal of Citizen Services',
  department: 'Ministry of Electronics & Information Technology',
  prototypeNotice: 'Prototype / Demo — Not an official Government of India website.',
  contact: {
    tollFree: '1800-111-5555',
    email: 'support-citizenservices@gov.in.demo',
    hours: 'Mon–Sat, 8:00 AM – 8:00 PM IST',
  },
  searchCategories: [{ value: 'all', label: 'All Categories' }],
};

export async function PortalChrome({ children }: { children: React.ReactNode }) {
  let config = FALLBACK_CONFIG;
  let navItems: { label: string; href: string }[] = [];
  let notices: { id: string; text: string; link: string; linkLabel: string }[] = [];

  try {
    [config, navItems, notices] = await Promise.all([
      getPortalConfig(),
      getDirectoryNav(),
      getNotices().catch(() => []),
    ]);
  } catch {
    // Use fallback when backend is offline
  }

  return (
    <>
      <Header config={config} notices={notices} />
      <DirectoryNavClient items={navItems} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </>
  );
}
