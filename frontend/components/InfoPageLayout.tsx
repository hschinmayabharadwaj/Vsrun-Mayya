import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FadeIn } from '@/components/MotionWrappers';

interface Crumb {
  label: string;
  href?: string;
}

interface InfoPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children: React.ReactNode;
}

export function InfoPageLayout({ title, description, breadcrumbs, children }: InfoPageLayoutProps) {
  const crumbs = breadcrumbs ?? [{ label: 'Home', href: '/' }, { label: title }];

  return (
    <div className="bg-background min-h-[60vh]">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
        <FadeIn>
          <Breadcrumbs items={crumbs} />
          <h1 className="text-headline-lg text-on-surface mb-3">{title}</h1>
          {description && (
            <p className="text-body-md text-on-surface-variant max-w-3xl mb-8 leading-relaxed">{description}</p>
          )}
        </FadeIn>
        {children}
      </div>
    </div>
  );
}

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, children, className = '' }: ContentCardProps) {
  return (
    <section className={`gov-card mb-6 ${className}`}>
      <h2 className="text-headline-md text-on-surface mb-4 pb-3 border-b border-outline-variant/50">{title}</h2>
      {children}
    </section>
  );
}

export function PageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-secondary hover:underline min-h-0 font-medium transition-colors">
      {children}
    </Link>
  );
}
