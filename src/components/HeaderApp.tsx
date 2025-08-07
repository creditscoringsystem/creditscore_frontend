// src/components/HeaderApp.tsx
'use client';

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { sections } from '@/configs/sectionsConfig';
import Icon from '@/components/AppIcon';

/**
 * HeaderApp component:
 * - Fixed full-width top header with translucent blur
 * - Logo + title on left (link to landing page)
 * - Scroll-spy navigation in center (links to landing page hashes)
 * - User avatar + name on right
 */
export default function HeaderApp() {
  const menuItems = sections;
  const activeId = useScrollSpy(menuItems.map(item => item.id), 80);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const newIndex = menuItems.findIndex(item => item.id === activeId);
    if (newIndex !== -1) setActiveIndex(newIndex);
  }, [activeId, menuItems]);

  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  const [positions, setPositions] = useState<{ left: number; right: number }[]>([]);

  const measure = () => {
    if (!containerRef.current) return;
    const ul = containerRef.current;
    const ulWidth = ul.clientWidth;
    const items = Array.from(ul.children) as HTMLElement[];
    setPositions(
      items.map(el => {
        const left = el.offsetLeft;
        const right = ulWidth - (left + el.offsetWidth);
        return { left, right };
      })
    );
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [activeIndex]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 bg-white bg-opacity-30 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Logo" width={48} height={48} />
            <span className="font-bold text-2xl text-[#22A521] ml-2">
              Credit Scoring System
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="relative flex-1 flex justify-center">
          {positions.length > 0 && activeIndex >= 0 && (
            <span
              className="absolute inset-y-0 m-auto h-10 rounded-full bg-white/60 transition-all duration-300"
              style={{
                left: positions[activeIndex].left,
                right: positions[activeIndex].right,
              }}
            />
          )}
          <ul
            ref={containerRef}
            className="flex items-center space-x-8 text-green-800 font-medium text-lg"
          >
            {menuItems.map(item => (
              <li key={item.id} className="z-10">
                <Link
                  href={`/#${item.id}`}
                  className="px-2 py-2 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-black">John Doe</div>
            <div className="text-xs text-black">Premium Member</div>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center neon-glow cursor-pointer hover:scale-105 transition-smooth">
              <Icon name="User" size={20} color="#0F0F0F" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card neon-glow" />
          </div>
        </div>
      </div>
    </header>
  );
}