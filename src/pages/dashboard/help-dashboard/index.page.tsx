// src/pages/dashboard/help-support-dashboard/index.tsx
'use client';

import React, { useMemo, useState } from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

type HelpItem = { title: string; description: string };
type HelpSection = { title: string; icon: string; items: HelpItem[] };
type FAQ = { question: string; answer: string };

export default function HelpSupportDashboard() {
  /* ---------- Data (static). Có thể thay bằng call API sau này ---------- */
  const helpSections: HelpSection[] = [
    {
      title: 'Getting Started',
      icon: 'Play',
      items: [
        { title: 'Understanding Your Credit Score', description: 'Learn how credit scores work and what factors influence them' },
        { title: 'Setting Up Alerts', description: 'Configure notifications for important credit changes' },
        { title: 'Reading Your Reports', description: 'Interpret your credit reports and identify key areas' }
      ]
    },
    {
      title: 'Features Guide',
      icon: 'BookOpen',
      items: [
        { title: 'Score Analysis', description: 'Deep dive into credit factor breakdowns and trends' },
        { title: 'Scenario Simulator', description: 'Model what-if scenarios for credit improvement' },
        { title: 'Alert Management', description: 'Customize and manage your notification preferences' }
      ]
    },
    {
      title: 'Account Support',
      icon: 'Settings',
      items: [
        { title: 'Profile Settings', description: 'Update your personal information and preferences' },
        { title: 'Privacy & Security', description: 'Manage your data privacy and account security' },
        { title: 'Subscription Management', description: 'View and modify your subscription plan' }
      ]
    }
  ];

  const faqs: FAQ[] = [
    {
      question: 'How often is my credit score updated?',
      answer: 'Your credit score is updated daily based on new information from credit bureaus. Major changes typically appear within 24–48 hours.'
    },
    {
      question: 'What factors affect my credit score the most?',
      answer: 'Payment history (35%) and credit utilization (30%) have the biggest impact. Length of history (15%), new credit (10%), and credit mix (10%) also matter.'
    },
    {
      question: 'How can I improve my credit score quickly?',
      answer: 'Pay down card balances to keep utilization below 30%, and make all payments on time. Avoid opening too many new accounts.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes. We use bank-level security (256-bit SSL). We never share your data without consent.'
    }
  ];

  /* ---------- State ---------- */
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ---------- Search filter ---------- */
  const filteredSections = useMemo(() => {
    if (!query.trim()) return helpSections;
    const q = query.toLowerCase();
    return helpSections
      .map(s => ({
        ...s,
        items: s.items.filter(it =>
          it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)
        )
      }))
      .filter(s => s.items.length > 0);
  }, [query]);

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }, [query]);

  /* ---------- Layout helpers (đồng bộ container & dịch sang phải) ---------- */
  const CONTAINER = 'mx-auto max-w-[1200px] px-6';
  // Dịch SANG PHẢI để có khoảng trống giống Overview khi zoom 100%
  // (tinh chỉnh theo breakpoint để responsive đẹp)
  const NUDGE_RIGHT =
    'md:transform md:translate-x-[120px] lg:translate-x-[160px] xl:translate-x-[200px] 2xl:translate-x-[-125px]';

  return (
    <DashboardShell>
      <div className={`${CONTAINER} ${NUDGE_RIGHT}`}>
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Help &amp; Support</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Find answers and make the most of your credit monitoring experience
          </p>
        </header>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card,#fff)] text-[var(--color-foreground,#0F172A)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neon,#12F7A0)] focus:border-transparent transition"
              aria-label="Search help"
            />
          </div>
        </div>

        {/* Sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {filteredSections.map(section => (
            <article key={section.title} className="bg-card rounded-lg border border-border p-6 shadow-elevation-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-neon,#12F7A0)]/10 flex items-center justify-center">
                  <Icon name={section.icon} size={20} className="text-[var(--color-neon,#12F7A0)]" />
                </div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.items.map(item => (
                  <li
                    key={item.title}
                    className="cursor-pointer rounded-lg p-3 hover:bg-muted border border-transparent hover:border-[var(--color-neon,#12F7A0)]/30 transition"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && e.currentTarget.click()}
                  >
                    <div className="text-[15px] font-medium">{item.title}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)]">{item.description}</div>
                  </li>
                ))}
                {section.items.length === 0 && (
                  <li className="text-sm text-[var(--color-muted-foreground)]">No matches.</li>
                )}
              </ul>
            </article>
          ))}
          {filteredSections.length === 0 && (
            <div className="lg:col-span-3 text-sm text-[var(--color-muted-foreground)]">
              No section matches your search.
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.question} className="bg-card rounded-lg border border-border shadow-elevation-1">
                  <button
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={18} className="shrink-0" />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredFaqs.length === 0 && (
              <div className="text-sm text-[var(--color-muted-foreground)]">No FAQs match your search.</div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-card rounded-lg border border-border p-8 text-center shadow-elevation-2 mb-14">
          <div className="w-16 h-16 rounded-full bg-[var(--color-neon,#12F7A0)]/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={26} className="text-[var(--color-neon,#12F7A0)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className="text-[var(--color-muted-foreground)] mb-6">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-6 h-11 neon-glow">
              <Icon name="LifeBuoy" size={18} className="mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="px-6 h-11">
              <Icon name="Send" size={18} className="mr-2" />
              Submit Feedback
            </Button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
