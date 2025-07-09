import React from "react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <span className="text-white text-lg font-semibold">Credit Scoring System</span>
        </div>
        <nav className="space-x-4 hidden md:flex text-white items-center">
          {["Home", "How It Works", "Features", "Payments", "FAQs"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="hover:underline"
            >
              {link}
            </a>
          ))}
          <Link href="/login" className="px-4 py-2 border border-white rounded hover:bg-white/20">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-white/30 rounded hover:bg-white/40">
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main
        className="flex-grow relative overflow-hidden font-sans"
        style={{
          background: "linear-gradient(90deg, rgba(212,255,235,0) 4%, rgba(195,255,99,0.46) 57%, #62DD61 100%)",
        }}
      >
        {/* Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-400 rounded-full opacity-50 filter blur-3xl" />
        <div className="absolute top-10 left-1/3 w-40 h-40 bg-green-300 rounded-full opacity-40 filter blur-2xl" />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-green-300 rounded-full opacity-50 filter blur-2xl" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-32 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-[56px] leading-[64px] font-bold text-[#64E963] tracking-tight">
              Know Your Credit.<br />
              Empower Your Future.
            </h1>
            <p className="text-gray-700 text-base leading-relaxed max-w-md mx-auto md:mx-0">
              Get instant insights into your credit score. Track, improve, and take control of your financial health.
            </p>
            <Link
              href="/login"
              className="inline-block bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full transition-transform transform hover:scale-105"
            >
              Check My Score Now →
            </Link>
          </div>

          {/* Credit Card */}
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src="/credit-card.png"
              alt="Credit Card"
              className="w-72 md:w-96 rounded-2xl transform rotate-6 backdrop-blur-lg bg-white/20 shadow-lg"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
