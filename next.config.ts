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
      { source: "/get-report", destination: "/crash-reports", permanent: true },
      { source: "/get-report/:path*", destination: "/crash-reports", permanent: true },
      { source: "/reports/:path*", destination: "/crash-reports", permanent: true },
      { source: "/legal-help", destination: "/", permanent: true },
      { source: "/get-help", destination: "/", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
      { source: "/for-lawyers", destination: "/", permanent: true },
      { source: "/search/progress", destination: "/search", permanent: true },
      { source: "/states/:state/accident-reports", destination: "/crash-reports/:state", permanent: true },
      { source: "/cities/:city/accident-reports", destination: "/crash-reports", permanent: false },
      { source: "/accidents/:state/:city/:slug", destination: "/accidents/:state", permanent: false },
      { source: "/accidents/:state/:city", destination: "/accidents/:state", permanent: false },
    ];
  },
};

export default nextConfig;
