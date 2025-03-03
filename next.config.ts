import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  images: {
    domains: ['placeholder.svg'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
