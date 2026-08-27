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

const FALLBACK_NOTICES = [
  { id: '1', text: 'System maintenance scheduled for Saturday 2:00 AM – 4:00 AM IST', link: '/help', linkLabel: 'Learn more' },
  { id: '2', text: 'Aadhaar enrollment centers now open on Sundays in select cities', link: '/services?category=identity_civil', linkLabel: 'Find centers' },
  { id: '3', text: 'Income Certificate processing time reduced to 3 working days', link: '/services', linkLabel: 'Apply now' },
  { id: '4', text: 'New grievance redressal portal launched for faster complaint resolution', link: '/grievance', linkLabel: 'File grievance' },
];

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

  if (notices.length === 0) notices = FALLBACK_NOTICES;
  else if (notices.length < 4) notices = [...notices, ...FALLBACK_NOTICES.slice(notices.length)];

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
