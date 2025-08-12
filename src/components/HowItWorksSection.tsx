'use client';
import type React from 'react';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ChartBarSquareIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

interface Step {
  title: string;
  desc: string;
  // Sửa kiểu để tương thích heroicons (ForwardRefExoticComponent)
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const steps: Step[] = [
  { title: 'Sign Up / Log In',  desc: 'Create an account and secure your data in seconds.',      Icon: UserPlusIcon },
  { title: 'Quick Survey',      desc: 'Answer a short finance & behaviour questionnaire.',       Icon: ClipboardDocumentListIcon },
  { title: 'Score & Insights',  desc: 'Instantly view a visual credit score with analysis.',     Icon: ChartBarSquareIcon },
  { title: 'Improvement Plan',  desc: 'Get a personalised checklist to boost your score.',       Icon: RocketLaunchIcon },
];

/* fade-in on first scroll */
const appear: Variants = {
  off: { opacity: 0, y: 60 },
  on:  (i: number) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', bounce: 0.25, delay: i * 0.15, duration: 0.6 },
  }),
};

function StepCard({ step, index, active }: { step: Step; index: number; active: boolean }) {
  return (
    <motion.li
      custom={index}
      variants={appear}
      initial="off"
      whileInView="on"
      viewport={{ once: true, amount: 0.4 }}
      animate={{ scale: active ? 1.06 : 1 }}
      whileHover={{ scale: active ? 1.12 : 1.08, y: -12 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="group relative rounded-2xl p-6 text-center
                 bg-white border border-[#2BB32A]/10 shadow-md"
    >
      {/* glow = pure box-shadow (không lem vào trong) */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
            style={{
              boxShadow: '0 0 40px 15px rgba(0,255,72,0.65)',
            }}
          />
        )}
      </AnimatePresence>

      {/* badge (desktop) */}
      <span className="hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2
                       h-8 w-8 items-center justify-center rounded-full
                       bg-[#2BB32A] text-white text-sm font-semibold shadow">
        {index + 1}
      </span>

      <step.Icon className="h-12 w-12 mx-auto text-[#2BB32A] transition-colors
                             group-hover:text-[#019100]" />

      <h3 className="mt-4 text-xl font-semibold text-[#019100]">
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#3D544D]">
        {step.desc}
      </p>
    </motion.li>
  );
}

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);

  /* đổi card sáng mỗi 3 s */
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % steps.length), 3000);
    return () => clearInterval(id);
  }, []);

  /* calc % vị trí tia sáng trên đường nối */
  const streakX = `${active * 33.333}%`; // 0 % → 33.3 % → 66.6 % → 100 %
  void streakX; // tránh cảnh báo biến chưa dùng

  return (
    <section id="how-it-works"
      className="relative overflow-hidden scroll-mt-[calc(4.5rem+2rem)] py-24">
      {/* dark glass bg */}
      <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-2xl" />

      {/* nhẹ nhàng blob trôi */}
      <motion.div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full
                   bg-[#00FF48]/25 blur-3xl"
        animate={{ x: [0, 80, -60, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* headline */}
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* glow nhịp thở */}
        <motion.span
          className="absolute inset-0 mx-auto h-14 w-72 rounded-full
                     bg-[#A3FFC0]/55 blur-[70px] -z-10"
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h2
          className="mb-4 text-4xl font-extrabold
                     bg-gradient-to-r from-[#C8FFD8] via-[#9CFFB0] to-[#C8FFD8]
                     bg-clip-text text-transparent"
        >
          How&nbsp;It&nbsp;Works
        </h2>
        <p className="text-lg text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
          Complete four lightning-fast steps to take control of your credit
          score.
        </p>
      </div>

      {/* ===== cards ===== */}
      <ol className="relative mx-auto mt-16 grid max-w-6xl gap-8 px-6
                     sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <StepCard key={s.title} step={s} index={i} active={i === active} />
        ))}
      </ol>
    </section>
  );
}
