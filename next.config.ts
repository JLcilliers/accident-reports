import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: "/get-report", destination: "/", permanent: false },
      { source: "/get-report/:path*", destination: "/", permanent: false },
      { source: "/reports/:path*", destination: "/", permanent: false },
      { source: "/legal-help", destination: "/", permanent: true },
      { source: "/get-help", destination: "/", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
      { source: "/for-lawyers", destination: "/", permanent: true },
      { source: "/search/progress", destination: "/search", permanent: true },
      { source: "/states/:state/accident-reports", destination: "/", permanent: false },
      { source: "/cities/:city/accident-reports", destination: "/", permanent: false },
      { source: "/accidents/:state/:city/:slug", destination: "/accidents/:state", permanent: false },
      { source: "/accidents/:state/:city", destination: "/accidents/:state", permanent: false },
    ];
  },
};

export default nextConfig;
