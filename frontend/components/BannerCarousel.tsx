'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';

interface BannerSlide {
  image: string;
  tag: string;
  icon: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

const SLIDES: BannerSlide[] = [
  {
    image: 'https://i0.wp.com/gksscholarship.com/wp-content/uploads/2026/02/GKS-Scholarship-2026-India-Graduate.jpg',
    // image: 'https://static.vecteezy.com/system/resources/thumbnails/026/540/630/small/15th-august-indian-independence-day-76th-celebration-free-vector.jpg',
    tag: 'New scheme',
    icon: 'lightbulb',
    title: 'Scholarship schemes open for 2026–27',
    subtitle: 'Explore education and skills scholarships available to eligible students this academic year.',
    cta: 'View schemes',
    href: '/services?search=scholarship',
  },
  {
    // image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=70',
    image: 'https://s3.youthkiawaaz.com/wp-content/uploads/2020/04/18094805/E-Governance-Service.jpg',
    tag: 'Online services',
    icon: 'apps',
    title: 'Do it online, skip the queues',
    subtitle: '12+ citizen services available end-to-end on the portal — apply, submit, and get updates digitally.',
    cta: 'Browse services',
    href: '/services',
  },
  {
    // image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70',
    image: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=1473',
    tag: 'Stay updated',
    icon: 'track_changes',
    title: 'Track every application in real time',
    subtitle: 'Enter your reference ID to see live status, or follow updates on your dashboard.',
    cta: 'Track application',
    href: '/track',
  },
  {
    // image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=70',
    image: 'https://notify.events/assets/YXBwL3RoZW1lL3N1Yi1sYW5kaW5nL2Rpc3Q=/img/svg/business/notify.events_for_business.svg',
    tag: 'Citizen alert',
    icon: 'phone_in_talk',
    title: 'Emergency helplines, one tap away',
    subtitle: 'National emergency numbers and department helplines are listed on the Helpline page.',
    cta: 'View helplines',
    href: '/helpline',
  },
];

const AUTOPLAY_MS = 5000;

export function BannerCarousel() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Notices and announcements"
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl shadow-elevated sm:aspect-[5/2]">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
          </motion.div>
        </AnimatePresence>

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col gap-3 p-5 md:p-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-label-sm font-semibold text-white backdrop-blur-md">
            <Icon name={slide.icon} size={14} />
            {slide.tag}
          </span>
          <div>
            <h2 className="max-w-2xl text-xl font-bold leading-tight text-white md:text-3xl">{slide.title}</h2>
            <p className="mt-1.5 max-w-lg text-body-sm text-white/85 md:text-body-md">{slide.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(slide.href)}
            className="btn-primary inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-label-sm text-white min-h-[42px]"
            style={{ minHeight: 42 }}
          >
            {slide.cta}
            <Icon name="arrow_forward" size={16} />
          </button>
        </div>

        {/* Arrows — bottom right */}
        <div className="absolute bottom-5 right-4 z-[3] flex items-center md:bottom-7 md:right-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/30"
            style={{ minHeight: 44, height: 44 }}
          >
            <Icon name="arrow_back" size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/30"
            style={{ minHeight: 44, height: 44 }}
          >
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>

        {/* Dots — bottom center, round pips */}
        <div className="absolute inset-x-0 bottom-4 z-[2] flex items-center justify-center gap-2 md:bottom-6">
          {SLIDES.map((item, i) => {
            const active = i === index;
            return (
              <span
                key={item.title}
                onClick={() => setIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setIndex(i);
                }}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                className="block cursor-pointer rounded-full transition-all duration-300"
                style={{
                  width: active ? 10 : 7,
                  height: active ? 10 : 7,
                  backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}