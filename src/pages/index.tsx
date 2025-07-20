import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const sectionIds = ['home', 'how-it-works', 'features', 'faqs'];
  const activeSection = useScrollSpy(sectionIds);

  return (
    <>
      <Head>
        <title>Credit Scoring System</title>
      </Head>

      <main className="relative min-h-screen pt-24 overflow-hidden">
        {/* Foreground content */}
        <section
          id="home"
          className="flex items-center justify-center min-h-[calc(100vh-6rem)] relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-green-900 text-center px-4 drop-shadow-[2px_1px_0_#1f7d1c] transition-transform duration-200 active:scale-95">
            Welcome to Credit Scoring UI
          </h1>
        </section>

        {/* Overlay when modal open */}
        {(showLogin || showSignup) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300" />
        )}

        {/* Navbar */}
        /*<header className="fixed top-0 left-0 right-0 z-40 bg-transparent backdrop-blur-md">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Logo" width={42} height={42} />
              <span className="font-bold text-xl md:text-2xl text-[#22A521]">
                Credit Scoring System
              </span>
            </div>

            {/* Navigation Links */}
            <ul className="hidden lg:flex gap-10 text-white text-base md:text-lg font-medium tracking-wide">
              {sectionIds.map((id) => (
                <li key={id}>
                  <Link
                    href={`#${id}`}
                    scroll={false}
                    className={`
                      px-2 pb-1 transition-colors duration-200
                      ${
                        activeSection === id
                          ? 'underline underline-offset-4 decoration-lime-300 decoration-[1.5px] text-white font-semibold'
                          : 'text-lime-200 hover:text-white'
                      }
                    `}
                  >
                    {id
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="hidden lg:flex gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 py-2 text-white text-base font-sans rounded-full hover:bg-white hover:text-black transition"
                style={{ borderWidth: '1.5px', borderColor: 'white' }}
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-5 py-2 text-white text-base font-sans rounded-full hover:bg-white hover:text-black transition"
                style={{ borderWidth: '1.5px', borderColor: 'white' }}
              >
                Sign up
              </button>
            </div>
          </nav>
        </header>

        {/* Modal - Login */}
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

        {/* Modal - Signup */}
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
