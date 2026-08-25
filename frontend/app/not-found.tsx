import Link from 'next/link';
import { Icon } from '@/components/Icon';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
        <Icon name="error" size={32} className="text-red-500" />
      </div>
      <h1 className="text-headline-lg font-display text-primary mb-4">Page Not Found</h1>
      <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2">
        <Icon name="arrow_back" size={18} className="text-white/80" />
        Return to Home
      </Link>
    </div>
  );
}
