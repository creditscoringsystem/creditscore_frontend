import Head from 'next/head';
import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LoginModal from '@/components/LoginModal';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import SignupModal from '@/components/SignupModal';
import Footer from '@/components/Footer'; // 👈 Thêm import Footer

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Callback khi login thành công
  const handleLoginSuccess = () => {
    setShowLogin(false);
    console.log('Logged in!');
  };

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

        {/* Hero Section */}
        <HeroSection />

        {/* Overlay khi mở modal */}
        {(showLogin || showSignup || showForgot) && (
          <div
            className="
              fixed inset-0
              bg-transparent         /* hoàn toàn trong suốt */
              backdrop-blur-md       /* chỉ blur nền phía sau */
              z-30
              transition-opacity duration-300
            "
          />
        )}

        {/* Modal Login */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={() => {
              setShowLogin(false);
              setShowForgot(true);
            }}
          />
        )}

        {/* Modal Forgot Password */}
        {showForgot && (
          <ForgotPasswordModal
            onClose={() => setShowForgot(false)}
            onBackToLogin={() => {
              setShowForgot(false);
              setShowLogin(true);
            }}
          />
        )}

        {/* Modal Signup – đã thay bằng component mới */}
        {showSignup && (
          <SignupModal
            onClose={() => setShowSignup(false)}
            onBackToLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}
      </main>

      {/* Thêm Footer */}
      <Footer />
    </>
  );
}
