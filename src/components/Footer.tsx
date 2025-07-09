import React from 'react';

const Footer: React.FC = () => (
  <footer className="mt-16 py-8 bg-white/20 backdrop-blur-md rounded-t-2xl text-center text-gray-800">
    <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
        <span className="font-semibold text-lg">Credit Scoring System</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {['Home', 'How It Works', 'Features', 'Payments', 'FAQs', 'Login', 'Sign up'].map((link) => (
          <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`} className="hover:underline">
            {link}
          </a>
        ))}
      </div>
    </div>
    <p className="mt-6 text-sm text-gray-600">&copy; {new Date().getFullYear()} Credit Scoring System. All rights reserved.</p>
  </footer>
);

export default Footer;
