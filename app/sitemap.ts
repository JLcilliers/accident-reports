import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { CRASH_REPORT_GUIDES } from "@/lib/crashReportGuides";
import { CITY_PAGES } from "@/lib/location/cityPages";
import { BRIEF_MARKER } from "@/lib/seo/brief";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";

export const revalidate = 21600; // Rebuild every 6 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1) Static routes (always included)
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/accidents",
    "/incidents",
    "/search",
    "/crash-reports",
    "/how-it-works",
    "/faq",
    "/about",
    "/blog",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const guideRoutes: MetadataRoute.Sitemap = CRASH_REPORT_GUIDES.map((guide) => ({
    url: `${BASE_URL}/crash-reports/${guide.slug}`,
    lastModified: new Date(`${guide.checkedOn}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITY_PAGES.map((city) => ({
    url: `${BASE_URL}/accidents/${city.state.toLowerCase()}/${city.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // 2) Dynamic routes from database (wrapped in try/catch for build resilience)
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // State pages (only those with real data)
    const states = await prisma.incident.groupBy({
      by: ["state"],
      where: { state: { not: null } },
    });

    const stateRoutes: MetadataRoute.Sitemap = states
      .filter((s) => s.state)
      .map((s) => ({
        url: `${BASE_URL}/accidents/${s.state!.toLowerCase()}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));

    // Individual incident pages, leaving out briefs (noindex until a second publisher's coverage brings the article)
    const incidents = await prisma.incident.findMany({
      where: { OR: [{ articleBody: null }, { NOT: { articleBody: { startsWith: BRIEF_MARKER } } }] },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    const incidentRoutes: MetadataRoute.Sitemap = incidents.map((incident) => ({
      url: `${BASE_URL}/incidents/${incident.slug}`,
      lastModified: incident.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    dynamicRoutes = [...stateRoutes, ...incidentRoutes];
  } catch (error) {
    console.log("[sitemap] Database not available during build, using static routes only");
  }

  return [...staticRoutes, ...guideRoutes, ...cityRoutes, ...dynamicRoutes];
}
