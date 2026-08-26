import Link from 'next/link';
import { InfoPageLayout } from '@/components/InfoPageLayout';
import { Icon } from '@/components/Icon';

export default function NotFound() {
  return (
    <InfoPageLayout
      title="Page Not Found"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: '404' }]}
    >
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-6">
          <Icon name="search_off" size={40} className="text-on-surface-variant" />
        </div>
        <h2 className="text-headline-lg text-on-surface mb-2">Page Not Found</h2>
        <p className="text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Icon name="home" size={18} className="text-white/80" />
          Return to Home
        </Link>
      </div>
    </InfoPageLayout>
  );
}
