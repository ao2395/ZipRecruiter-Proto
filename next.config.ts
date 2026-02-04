import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Only use rewrites in local development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        },
      ];
    }
    // In production (Vercel), /api routes are handled by serverless functions
    return [];
  },
};

export default nextConfig;
