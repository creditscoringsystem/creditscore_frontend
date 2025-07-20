// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">CreditScore</div>
        <nav className="space-x-6">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
          <Link href="/register" className="hover:text-blue-600 transition">Register</Link>
        </nav>
      </div>
    </header>
  );
} 