// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => (
  <footer
    className="
      w-full
      bg-gradient-to-r from-[#3E8A2F] via-[#3E8A2FCC] to-[#2E6620]/50

      backdrop-blur-xl shadow-xl z-40
      text-white transition-all
      "
    style={{

      minHeight: 62, // giảm bớt chiều cao
      padding: "0 0 0 0",
    }}
  >
    <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row md:items-start items-center md:justify-between relative">
      {/* Hiệu ứng blur trắng dưới logo+brand */}
      <div className="absolute -left-80 -top-10 md:top-[10%] -translate-y-1/2 md:translate-y-[-20%] pointer-events-none -z-1"
           style={{
             width: 500, height: 150,
             filter: "blur(50px)",
             opacity: 0.5,
             background: "#38ad21ff",
             borderRadius: "50%",
           }} />

      {/* Logo + Brand */}
      <div className="flex flex-col mt-5">
        <div className="flex items-center space-x-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Credit Scoring System Logo" className="h-10 w-auto" />
          <span className="font-semibold text-lg text-white">Credit Scoring System</span>
        </div>
        <span className="text-xs font-normal text-white mt-2 ml-13">
          Unlock your credit potential with confidence.
        </span>
      </div>

      {/* Menu + Info */}
      <div className="hidden md:flex flex-row gap-9 text-sm mt-6 md:mt-0 z-10">
        <div>
          <div className="font-bold mb-2">Company</div>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Features</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Support</div>
          <ul className="space-y-1">
            <li>
              <a href="tel:+84123456789" className="hover:underline">Hotline: 0123 456 789</a>
            </li>
            <li>
              <a href="mailto:support@creditscore.vn" className="hover:underline">support@creditscore.vn</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    {/* Dòng dưới cùng – đã nâng cách đáy 8px */}
    <div className="border-t border-white/15 mt-1 pt-2 pb-2 flex flex-col md:flex-row items-center justify-between text-xs text-white/80 px-6">
      <span className="mb-1 md:mb-0">
        © 2025 Credit Scoring System. All rights reserved.
      </span>
      <span>
        This page uses cookies. See details <a href="#" className="underline">here</a>.
      </span>
    </div>
  </footer>
);

export default Footer;
