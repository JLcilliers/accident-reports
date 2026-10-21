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
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path((?!api/|_next/).*)",
        has: [{ type: "host", value: "accident-reports.vercel.app" }],
        destination: "https://www.carcrashreport.com/:path",
        permanent: true,
      },
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
      { source: "/accidents/:state/:city/page/1", destination: "/accidents/:state/:city", permanent: true },
    ];
  },
};

export default nextConfig;
