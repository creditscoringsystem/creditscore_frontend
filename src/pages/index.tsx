import Head from "next/head";
import { useState } from "react";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import SignupModal from "@/components/SignupModal";
import Footer from "@/components/Footer";

// ✨ import cấu hình sections
import { sections } from "@/configs/sectionsConfig";


export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    console.log("Logged in!");
  };

  return (
    <>
      <Head>
        <title>Credit Scoring System</title>
      </Head>

      <main className="relative min-h-screen pt-24">
        <Header
          onShowLogin={() => setShowLogin(true)}
          onShowSignup={() => setShowSignup(true)}
        />

        {/* ✨ Map qua sections để render */}
        <div className="bg-[linear-gradient(to-bottom,transparent_0%,rgba(169,255,99,0.877)_30%,rgba(97,221,97,0.9)_60%,rgba(0,255,76,0.768)_90%)]">
          {sections.map(({ id, Component }) => (
            <section key={id} id={id} className="scroll-mt-[6rem]">
              <Component />
            </section>
          ))}
        </div>

        {(showLogin || showSignup || showForgot) && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md z-30 transition-opacity duration-300" />
        )}

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
        {showForgot && (
          <ForgotPasswordModal
            onClose={() => setShowForgot(false)}
            onBackToLogin={() => {
              setShowForgot(false);
              setShowLogin(true);
            }}
          />
        )}
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

      <Footer />
    </>
  );
}
