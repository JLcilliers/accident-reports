import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1) Static routes (always included)
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/accidents",
    "/search",
    "/legal-help",
    "/how-it-works",
    "/for-lawyers",
    "/faq",
    "/about",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1.0 : 0.8,
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

    // Individual incident pages
    const incidents = await prisma.incident.findMany({
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

  return [...staticRoutes, ...dynamicRoutes];
}
