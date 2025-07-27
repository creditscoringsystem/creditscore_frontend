import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { sections } from "@/configs/sectionsConfig";


interface HeaderProps {
  onShowLogin: () => void;
  onShowSignup: () => void;
}

export default function Header({ onShowLogin, onShowSignup }: HeaderProps) {
  const menuItems = sections;

  const activeId = useScrollSpy(menuItems.map((item) => item.id), 80);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const newIndex = menuItems.findIndex((item) => item.id === activeId);
    if (newIndex !== -1) {
      setActiveIndex(newIndex);
    }
  }, [activeId, menuItems]);

  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLUListElement>(null);
  const [positions, setPositions] = useState<{ left: number; right: number }[]>([]);

  const measure = () => {
    if (!containerRef.current) return;
    const ul = containerRef.current;
    const ulWidth = ul.clientWidth;
    const items = Array.from(ul.children) as HTMLElement[];
    setPositions(
      items.map((el) => {
        const left = el.offsetLeft;
        const right = ulWidth - (left + el.offsetWidth);
        return { left, right };
      })
    );
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [activeIndex]);

  return (
    <header
      ref={headerRef}
      className="w-full fixed top-6 left-0 z-50 flex justify-center items-center gap-6 px-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="Logo" width={48} height={48} />
        <span className="font-bold text-2xl text-[#22A521]">
          Credit Scoring System
        </span>
      </div>

      {/* Nav */}
      <div className="relative rounded-full bg-white/40 backdrop-blur-sm shadow-sm h-12 flex items-center px-4">
        {positions.length > 0 && activeIndex >= 0 && (
          <span
            className="absolute top-0 bottom-0 m-auto h-12 rounded-full bg-white/60 transition-all duration-300"
            style={{
              left: `${positions[activeIndex].left}px`,
              right: `${positions[activeIndex].right}px`,
            }}
          />
        )}
        <ul
          ref={containerRef}
          className="relative flex items-center gap-8 text-green-800 font-medium text-lg"
        >
          {menuItems.map((item) => (
            <li key={item.id} className="relative z-10">
              <Link href={`#${item.id}`} className="px-3 cursor-pointer">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onShowLogin}
          className="h-12 px-8 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition"
        >
          Login
        </button>
        <button
          onClick={onShowSignup}
          className="h-12 px-8 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition"
        >
          Sign up
        </button>
      </div>
    </header>
  );
}
