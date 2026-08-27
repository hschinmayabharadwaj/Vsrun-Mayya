import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getNotices, getPortalConfig } from '@/lib/portal-api';
import { ServiceCard } from '@/components/ServiceCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/MotionWrappers';
import { Icon } from '@/components/Icon';
import type { Service } from '@/lib/types';

const categories = [
  { label: 'Identity & Civil', description: 'Certificates, IDs and essential records', icon: 'fingerprint', href: '/services?category=identity_civil', color: 'text-info', bg: 'bg-info/10' },
  { label: 'Education & Skills', description: 'Scholarships, learning and employment', icon: 'school', href: '/services?category=education_skills', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Health & Welfare', description: 'Healthcare, benefits and social support', icon: 'local_hospital', href: '/services?category=health_welfare', color: 'text-success', bg: 'bg-success/10' },
  { label: 'Business & Trade', description: 'Licences, registrations and commerce', icon: 'storefront', href: '/services?category=business_trade', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Housing & Land', description: 'Property, residence and local services', icon: 'home', href: '/services?category=housing_land', color: 'text-error', bg: 'bg-error/10' },
  { label: 'Help & Grievance', description: 'Find answers or raise a complaint', icon: 'report_problem', href: '/grievance', color: 'text-rose-600', bg: 'bg-rose-50' },
];

export default async function HomePage() {
  let popularServices: Service[] = [];
  let notices: Awaited<ReturnType<typeof getNotices>> = [];
  let config: Awaited<ReturnType<typeof getPortalConfig>> | null = null;
  let error: string | null = null;

  try {
    [popularServices, notices, config] = await Promise.all([
      apiFetch<Service[]>('/api/services?popular=true'),
      getNotices(),
      getPortalConfig(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unable to load portal content';
  }

  const siteName = config?.siteName ?? 'Citizen Services Portal';
  const contact = config?.contact;

  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-white to-green-50">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-15">
          <div className="flex flex-col md:flex-row items-start gap-8 md:items-center">
            {/* National Emblem + Logo */}
            <FadeIn delay={0.05}>
              <div className="shrink-0 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Emblem_of_India.svg"
                  alt="National Emblem of India"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.webp"
                  alt="Portal Logo"
                  className="w-20 h-20 md:w-28 md:h-28 rounded-2xl shadow-soft object-cover"
                />
              </div>
            </FadeIn>

            <div className="max-w-3xl">
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/indian-flag.svg" alt="Indian Flag" className="w-8 h-5 rounded-sm" />
                  <p className="text-label-lg text-on-surface-variant tracking-wide uppercase">Government of India</p>
                </div>
                <h1 className="text-display-lg md:text-display-xl text-on-surface mb-4">
                  {config?.siteName ?? 'Citizen Services Portal'}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
                  Access essential citizen services, track applications, file grievances, and find official
                  helpline numbers — designed for clarity and ease of use.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Quick access cards */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb- 12 mt-4">
              {[
                { href: '/services', label: 'Services Directory', desc: 'Browse and apply for services', icon: 'apps', color: 'text-info', bg: 'bg-info/8' },
                { href: '/track', label: 'Track Application', desc: 'Check status by reference ID', icon: 'track_changes', color: 'text-secondary', bg: 'bg-secondary/8' },
                { href: '/helpline', label: 'Helpline', desc: 'Emergency and department numbers', icon: 'phone_in_talk', color: 'text-success', bg: 'bg-success/8' },
                { href: '/grievance', label: 'Grievance', desc: 'File and track complaints', icon: 'report_problem', color: 'text-error', bg: 'bg-error/8' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="gov-card flex items-start gap-3 group min-h-0"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:opacity-80 transition-opacity`}>
                    <Icon name={item.icon} size={20} className={item.color} />
                  </div>
                  <div>
                    <span className="block font-semibold text-on-surface mb-0.5">{item.label}</span>
                    <span className="block text-body-sm text-on-surface-variant">{item.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="relative z-10 -mt-5 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto rounded-2xl border border-outline-variant bg-surface p-4 shadow-elevated md:p-5">
          <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-4 md:divide-x md:divide-outline-variant">
            {[
              { label: 'Services Available', value: '12+', icon: 'apps', color: 'text-info' },
              { label: 'Applications Processed', value: '1,250+', icon: 'task_alt', color: 'text-success' },
              { label: 'Average Processing', value: '3-5 Days', icon: 'schedule', color: 'text-secondary' },
              { label: 'Satisfaction Rate', value: '98%', icon: 'thumb_up', color: 'text-success' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <Icon name={stat.icon} size={24} className={`${stat.color} mx-auto mb-2`} />
                  <p className="text-headline-md font-bold text-on-surface">{stat.value}</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Digital India banner */}
      <FadeIn>
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6 px-8 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-green-50 border border-outline-variant/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Emblem_of_India.svg" alt="National Emblem" className="w-14 h-14" />
            <div className="text-center sm:text-left">
              <p className="text-headline-md font-bold text-on-surface">Digital India</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Powering Citizen Services Through Technology</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/digital-india.svg" alt="Digital India Initiative" className="h-12" />
          </div>
        </section>
      </FadeIn>

      {/* Popular services */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <FadeIn>
            <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-secondary">Popular right now</p>
            <h2 className="mt-1 text-headline-lg text-[#123A63] md:text-3xl">Start with a popular service</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">Frequently used services, ready when you are.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link href="/services" className="inline-flex items-center gap-1 text-body-sm font-semibold text-secondary hover:underline min-h-0">
              View all services <Icon name="arrow_forward" size={16} />
            </Link>
          </FadeIn>
        </div>

        {error && !popularServices.length ? (
          <div className="rounded-2xl border border-error/20 bg-error/5 p-5 text-body-sm text-error" role="alert">
            <div className="flex items-start gap-3">
              <Icon name="error" size={20} className="shrink-0" />
              <div>
                <p className="font-semibold">Services are temporarily unavailable</p>
                <p className="mt-1 text-on-surface-variant">You can still browse the portal sections above. Please try again shortly.</p>
              </div>
            </div>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularServices.slice(0, 6).map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} compact />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      <section className="border-y border-outline-variant bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <FadeIn>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-secondary">Explore by need</p>
                <h2 className="mt-1 text-headline-lg text-[#123A63] md:text-3xl">Find your way around</h2>
                <p className="mt-1 max-w-xl text-body-sm text-on-surface-variant">Browse services by category, or get direct help when you need it.</p>
              </div>
              <Link href="/departments" className="inline-flex items-center gap-1 text-body-sm font-semibold text-secondary hover:underline min-h-0">
                View departments <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          </FadeIn>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <StaggerItem key={category.label}>
                <Link href={category.href} className="group flex items-start gap-4 rounded-2xl border border-outline-variant bg-[#fbfdff] p-5 hover:-translate-y-0.5 hover:border-[#a9cae8] hover:shadow-card-hover min-h-0">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${category.bg} ${category.color} transition-colors group-hover:opacity-80`}>
                    <Icon name={category.icon} size={22} />
                  </span>
                  <span>
                    <span className="block text-body-md font-semibold text-[#123A63]">{category.label}</span>
                    <span className="mt-1 block text-body-sm leading-relaxed text-on-surface-variant">{category.description}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-label-sm font-semibold text-secondary">Explore <Icon name="arrow_forward" size={14} /></span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-mobile py-12 md:px-margin-desktop md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#123A63] p-7 text-white md:p-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-white/5" />
            <p className="relative text-label-sm font-semibold uppercase tracking-[0.16em] text-[#ffb36d]">Simple by design</p>
            <h2 className="relative mt-2 max-w-lg text-3xl font-bold leading-tight md:text-4xl">From application to resolution, stay in control.</h2>
            <p className="relative mt-4 max-w-xl text-body-md leading-relaxed text-white/70">Submit your request, follow each update, and get the help you need without the guesswork.</p>
            <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { number: '01', title: 'Choose', icon: 'apps' },
                { number: '02', title: 'Submit', icon: 'send' },
                { number: '03', title: 'Track', icon: 'track_changes' },
              ].map((step) => (
                <div key={step.number} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between text-[#ffb36d]"><span className="text-label-sm font-semibold">{step.number}</span><Icon name={step.icon} size={18} /></div>
                  <p className="mt-5 text-body-sm font-semibold">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#f0d8c9] bg-[#fff8f1] p-7 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-secondary shadow-soft"><Icon name="phone_in_talk" size={23} /></div>
            <p className="mt-6 text-label-sm font-semibold uppercase tracking-[0.16em] text-secondary">Need a hand?</p>
            <h2 className="mt-2 text-2xl font-bold text-[#123A63]">We are here to help.</h2>
            <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">Connect with the citizen support team for service guidance and general queries.</p>
            <Link href="/helpline" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#123A63] px-4 py-3 text-label-lg text-white hover:bg-[#1d6fb8] min-h-[46px]">
              View helplines <Icon name="arrow_forward" size={17} />
            </Link>
            {contact && <p className="mt-4 text-label-sm text-on-surface-variant">Toll-free: <strong className="text-[#123A63]">{contact.tollFree}</strong></p>}
          </div>
        </div>
      </section>
    </div>
  );
}
