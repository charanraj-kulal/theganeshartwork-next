import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['decorior.in'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig;
