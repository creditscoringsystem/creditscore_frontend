import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  //Bỏ qua ESLint errors trong lúc build (dev vẫn lint bình thường)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
