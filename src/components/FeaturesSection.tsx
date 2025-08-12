// src/components/FeaturesSection.tsx
'use client';
import type React from 'react';

import { motion, Variants } from 'framer-motion';
import {
  BoltIcon,
  PresentationChartBarIcon,
  BellAlertIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';

type Pillar = {
  title: string;
  tagline: string;
  expandedText: string;
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
  gradient: string;
  textColor: string;
};

const pillars: Pillar[] = [
  {
    title: 'Smart Onboarding & Instant Score',
    tagline: 'Survey once, score instantly.',
    expandedText:
      'From the splash screen to a verified account in under five minutes. OTP-based sign‑up, instant 2‑factor setup, and a 30‑question assessment covering basics, credit use, payment habits, and psychometrics. Our ML model crunches 30+ factors and returns a 0‑1000 score—no bank data required.',
    Icon: BoltIcon,
    gradient: 'from-[#019100] to-[#22A521]',
    textColor: 'text-green-800',
  },
  {
    title: 'Interactive Insight Hub',
    tagline: 'Simulate and master your data.',
    expandedText:
      'A 360° dashboard with a live half‑donut gauge, colour‑coded risk badge, and month‑over‑month trend line. Drill into the Factors table to see SHAP weights, then launch the What‑If Simulator to preview score changes before you act. One click updates data or dives deeper.',
    Icon: PresentationChartBarIcon,
    gradient: 'from-[#22A521] to-[#64E963]',
    textColor: 'text-green-800',
  },
  {
    title: 'Proactive Alerts & Deep Reports',
    tagline: 'Stay informed, export anytime.',
    expandedText:
      'Real‑time notifications via push, email, or SMS the moment your score shifts or a bill is due. A tabbed inbox keeps unread alerts in sight. Explore a daily timeline of score history and export polished PDFs or raw CSVs for any date range—perfect for advisors and audits.',
    Icon: BellAlertIcon,
    gradient: 'from-[#64E963] to-[#76ED6E]',
    textColor: 'text-[#019100]',
  },
  {
    title: 'Enterprise Security & Control',
    tagline: 'Built-in transparency.',
    expandedText:
      'ISO 27001‑grade AES‑256 encryption, TLS 1.3, and device‑level session logs. Toggle 2FA, revoke data‑source consent, or switch language and theme in seconds. The ML engine exposes SHAP/LIME explanations so you always know why your score moved—and who accessed your data.',
    Icon: ShieldCheckIcon,
    gradient: 'from-[#76ED6E] to-[#87FF42]',
    textColor: 'text-[#019100]',
  },
];

const typewriter: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: { width: '100%', opacity: 1 },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      {/* HEADER */}
      <div className="relative text-center max-w-2xl mx-auto px-4 mb-14">
        <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-32 w-32 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 opacity-20 blur-3xl z-0" />
        <h2 className="text-4xl font-extrabold text-green-600 relative z-10 drop-shadow-lg">
          Core Features
        </h2>
        <div className="mx-auto mt-3 h-1.5 w-32 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 relative z-10" />
        <p className="mt-4 text-gray-600 relative z-10">
          Explore the four pillars designed to empower your credit journey.
        </p>
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid max-w-6xl mx-auto px-6 gap-6 grid-cols-2 auto-rows-[240px]">
        {pillars.map((p, idx) => (
          <motion.div
            key={p.title}
            initial="rest"
            whileHover="hover"
            className="
              relative overflow-hidden rounded-2xl
              bg-white/20 backdrop-blur-lg border border-white/20 shadow-sm
              group
            "
          >
            {/* gradient underlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-10 z-0`}
            />
            {/* shimmer */}
            <div
              className="
                absolute inset-0
                bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),rgba(255,255,255,0))]
                opacity-0 group-hover:opacity-60
                transition-opacity duration-500 z-10 pointer-events-none
              "
            />

            {/* CONTENT */}
            <div className="relative z-20 flex flex-col h-full p-6">
              <div className="flex items-center gap-3">
                <p.Icon className={`h-8 w-8 ${p.textColor}`} />
                <h3 className={`text-xl font-semibold ${p.textColor}`}>
                  {p.title}
                </h3>
              </div>
              <p className={`mt-2 text-sm ${p.textColor}`}>{p.tagline}</p>
              <motion.p
                variants={typewriter}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'linear', delay: idx * 0.3 }}
                className={`mt-4 text-sm ${p.textColor} overflow-hidden whitespace-pre-wrap border-r-2 border-current pr-1`}
              >
                {p.expandedText}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MOBILE GRID */}
      <div className="md:hidden px-6 grid grid-cols-1 gap-6">
        {pillars.map((p, idx) => (
          <motion.div
            key={p.title}
            initial="rest"
            whileHover="hover"
            className="
              relative overflow-hidden rounded-2xl
              bg-white/20 backdrop-blur-lg border border-white/20 shadow-sm h-72
              group
            "
          >
            {/* gradient underlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-10 z-0`}
            />
            {/* shimmer */}
            <div
              className="
                absolute inset-0
                bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),rgba(255,255,255,0))]
                opacity-0 group-hover:opacity-60
                transition-opacity duration-500 z-10 pointer-events-none
              "
            />

            {/* CONTENT */}
            <div className="relative z-20 flex flex-col h-full p-6">
              <div className="flex items-center gap-3">
                <p.Icon className={`h-8 w-8 ${p.textColor}`} />
                <h3 className={`text-xl font-semibold ${p.textColor}`}>
                  {p.title}
                </h3>
              </div>
              <p className={`mt-2 text-sm ${p.textColor}`}>{p.tagline}</p>
              <motion.p
                variants={typewriter}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'linear', delay: idx * 0.3 }}
                className={`mt-4 text-sm ${p.textColor} overflow-hidden whitespace-pre-wrap border-r-2 border-current pr-1`}
              >
                {p.expandedText}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
