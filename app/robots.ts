import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";

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
