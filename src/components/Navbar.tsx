import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const menuItems = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "features", label: "Features" },
  { id: "faqs", label: "FAQs" },
];

export default function NavBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<
    { left: number; width: number }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = Array.from(
      containerRef.current.querySelectorAll<HTMLLIElement>("li")
    );
    const newPositions = items.map((item) => ({
      left: item.offsetLeft,
      width: item.offsetWidth,
    }));
    setPositions(newPositions);
  }, []);

  return (
    <nav className="w-full flex justify-center mt-8">
      {/* Rectangle 1 */}
      <div className="relative flex rounded-full bg-white/40 px-4 py-2">
        {/* Rectangle 2 */}
        {positions.length > 0 && (
          <span
            className="absolute top-1 bottom-1 rounded-full bg-white/80 transition-all duration-300"
            style={{
              left: positions[activeIndex]?.left,
              width: positions[activeIndex]?.width,
            }}
          />
        )}

        {/* Menu items */}
        <ul
          ref={containerRef}
          className="relative flex items-center gap-6 text-green-800 font-semibold"
        >
          {menuItems.map((item, index) => (
            <li
              key={item.id}
              className="relative px-4 py-1 cursor-pointer z-10"
              onClick={() => setActiveIndex(index)}
            >
              <Link href={`#${item.id}`} scroll={false}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
