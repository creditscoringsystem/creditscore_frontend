'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);

  return null;
};

export default ScrollToTop;
