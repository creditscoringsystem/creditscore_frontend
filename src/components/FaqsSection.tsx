import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import clsx from 'clsx';

/* =========================================================
   1.  FAQ DATA  (question + answer)
   ========================================================= */
const faqData = {
  Scoring: [
    {
      q: 'How is my score calculated if I don’t link a bank?',
      a: 'A 30‑question assessment on income, credit use, payment habits and psychometrics feeds an ML model that outputs a 0‑1000 score—no bank data needed.',
    },
    {
      q: 'Will the survey affect my official credit file?',
      a: 'No. Our calculation is internal and never queries credit bureaus, so your real‑world credit record stays untouched.',
    },
    {
      q: 'What do the gauge colours mean?',
      a: 'Green ≥ 750 = low risk • Amber 600‑749 = medium • Red < 600 = high—improvement advised.',
    },
    {
      q: 'How accurate is the What‑If simulator?',
      a: 'Simulated results are usually within ±5 % of the score you’ll get after making the real change.',
    },
    {
      q: 'How long does the onboarding take?',
      a: 'OTP verification plus the survey typically takes under five minutes.',
    },
  ],

  Security: [
    {
      q: 'How is my data secured?',
      a: 'AES‑256 encryption at rest, TLS 1.3 in transit, ISO 27001 processes, and device‑level session logs.',
    },
    {
      q: 'What encryption do you use?',
      a: 'AES‑256 symmetric encryption with server‑side HSM‑managed keys.',
    },
    {
      q: 'Can I revoke access anytime?',
      a: 'Yes—Settings → Privacy. Click “Revoke” next to any data source to cut access instantly.',
    },
    {
      q: 'Is biometric authentication supported?',
      a: 'Face ID / Touch ID are available on supported devices—enable it in Settings → Security.',
    },
  ],

  Account: [
    {
      q: 'How do I delete my account?',
      a: 'Go to Settings → Privacy → Delete Account, confirm via OTP. All personal data is erased within 24 h.',
    },
    {
      q: 'Can I change my email?',
      a: 'Yes—Settings → Profile. Enter the new email and verify via OTP.',
    },
    {
      q: 'How do I update my profile info?',
      a: 'In Profile, click the pencil icon next to each field, edit, then save.',
    },
    {
      q: 'How do I enable two‑factor authentication?',
      a: 'Open Settings → Security and toggle “Two‑Factor Authentication”; follow the OTP prompt.',
    },
  ],

  'Data & Export': [
    {
      q: 'Can I export my history?',
      a: 'Timeline → Export lets you download PDF or CSV for any date range.',
    },
    {
      q: 'Can I download my credit score data?',
      a: 'Click “Download Score” on the dashboard to save your latest score as PDF.',
    },
    {
      q: 'How do I share reports with others?',
      a: 'Generate a PDF report and share the file or a time‑limited link (expires in 24 h).',
    },
  ],
};

const categories = Object.keys(faqData);

/* =========================================================
   2.  COMPONENT
   ========================================================= */
export default function FaqsSection() {
  const [selectedCategory, setSelectedCategory] = useState('Scoring');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="
        relative w-full
        bg-gradient-to-br from-lime-100 to-green-400/40
        backdrop-blur-sm pt-24 pb-24 px-4 md:px-20
        font-sans
      "
    >
      {/* Decorative Fade Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-[rgb(245,255,235)] pointer-events-none" />

      {/* Main Box */}
      <div
        className="
          relative z-10
          w-full
          mx-auto
          py-20 px-6
          bg-white/70
          backdrop-blur-xl
          rounded-3xl
        "
      >
        <h2 className="text-center text-3xl font-bold text-[#0AC909] mb-6">
          FAQs
        </h2>

        {/* Search (static, non‑functional placeholder) */}
        <div className="relative max-w-3xl mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search a question..."
            className="
              w-full pl-10 pr-4 py-2 rounded-full
              bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#0AC909]
              text-sm
            "
          />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setOpenIndex(null);
              }}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition',
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {faqData[selectedCategory].map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-900 text-base font-medium"
              >
                {item.q}
                <ChevronDown
                  className={clsx(
                    'h-5 w-5 text-gray-400 transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
