'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface NavItem {
  href: string;
  label: string;
}

interface FloatingPillNavigationProps {
  items: NavItem[];
  className?: string;
}

export function FloatingPillNavigation({ items, className }: FloatingPillNavigationProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const activeItem = items.find(
      (item) => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))
    );
    if (!activeItem) {
      setPill(null);
      return;
    }

    const el = itemRefs.current.get(activeItem.href);
    const container = containerRef.current;
    if (!el || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setPill({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    });
  }, [pathname, items]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative flex items-center bg-neutral-100 rounded-full p-1',
        className
      )}
    >
      {/* Animated pill */}
      {pill && (
        <motion.div
          className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm"
          initial={false}
          animate={{
            left: pill.left,
            width: pill.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      {/* Nav items */}
      {items.map((item) => {
        const isActive =
          item.href === pathname ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              if (el) itemRefs.current.set(item.href, el);
            }}
            className={clsx(
              'relative z-10 px-4 py-2 text-body-sm font-medium rounded-full transition-colors duration-200 min-h-[36px] flex items-center',
              isActive
                ? 'text-secondary font-semibold'
                : 'text-on-surface hover:text-on-surface'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
