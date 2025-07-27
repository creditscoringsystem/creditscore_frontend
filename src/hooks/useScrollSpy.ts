// src/hooks/useScrollSpy.ts
import { useEffect, useState } from 'react';

export const useScrollSpy = (ids: string[], offset = 100) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -20% 0px`, // tinh chỉnh để top section dễ nhận
        threshold: 0.5,
      }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, offset]);

  // 🏷️ Bắt sự kiện scroll để khi ở top thì luôn là Home
  useEffect(() => {
    const handleTop = () => {
      if (window.scrollY < 10) {
        setActiveId(ids[0]); // ép về Home
      }
    };
    window.addEventListener('scroll', handleTop);
    return () => window.removeEventListener('scroll', handleTop);
  }, [ids]);

  return activeId;
};
