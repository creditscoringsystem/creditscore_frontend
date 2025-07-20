// src/pages/index.tsx
import Head from 'next/head';
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Head>
        <title>Credit Scoring System</title>
      </Head>

      <main className="relative min-h-screen pt-24 overflow-hidden">
        {/* Header mới có logo, menu highlight, login/signup */}
        <Header
          onShowLogin={() => setShowLogin(true)}
          onShowSignup={() => setShowSignup(true)}
        />

        {/* Hero Section thay thế phần Welcome cũ */}
        <HeroSection />

        {/* Overlay khi mở modal */}
        {(showLogin || showSignup) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300" />
        )}

        {/* Modal Login */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Login</h2>
              <p className="text-sm text-gray-600">Login form coming soon...</p>
            </div>
          </div>
        )}

        {/* Modal Signup */}
        {showSignup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
              <button
                onClick={() => setShowSignup(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Sign up</h2>
              <p className="text-sm text-gray-600">Signup form coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
