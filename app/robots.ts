import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/get-report/", "/search/progress"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
