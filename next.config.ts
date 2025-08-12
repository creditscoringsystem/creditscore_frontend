import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Bỏ qua ESLint errors khi build (dev vẫn lint bình thường)
  eslint: { ignoreDuringBuilds: true },

  // Chỉ các file có hậu tố .page.* mới là page/route.
  // Mọi component .tsx nằm trong pages/**/components/** sẽ không bị coi là page nữa.
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'api.ts', 'api.js'],
};

export default nextConfig;
