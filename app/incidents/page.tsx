import Link from "next/link";
import prisma from "@/lib/prisma";
import { stripHtmlAndPublisher, cleanRssSnippet } from "@/lib/text";

export const revalidate = 300; // Re-generate every 5 minutes

export const metadata = {
  title: "Recent Traffic Incidents | AccidentReports",
  description:
    "Browse the latest traffic accidents and incidents across the United States. Updated automatically from news sources.",
};

type IncidentWithSources = {
  id: string;
  slug: string;
  headline: string;
  summary: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  dedupeKey: string;
  sources: { id: string }[];
};

async function getRecentIncidents(): Promise<IncidentWithSources[]> {
  try {
    return await prisma.incident.findMany({
      orderBy: { occurredAt: "desc" },
      take: 50,
      include: {
        sources: {
          take: 1,
        },
      },
    });
  } catch {
    console.log("[incidents] Database not available");
    return [];
  }
}

async function getIncidentStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [total, todayCount, weekCount] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({
        where: { occurredAt: { gte: today } },
      }),
      prisma.incident.count({
        where: { occurredAt: { gte: weekAgo } },
      }),
    ]);

    return { total, todayCount, weekCount };
  } catch {
    return { total: 0, todayCount: 0, weekCount: 0 };
  }
}

export default async function IncidentsPage() {
  const [incidents, stats] = await Promise.all([
    getRecentIncidents(),
    getIncidentStats(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-800 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Recent Incidents</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Recent Traffic Incidents
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Browse the latest traffic accidents and incidents across the United
            States. Our database is updated automatically from news sources.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.todayCount}</p>
            <p className="text-sm text-slate-600">Today</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.weekCount}</p>
            <p className="text-sm text-slate-600">This Week</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Total</p>
          </div>
        </div>

        {/* Incidents List */}
        {incidents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <svg
              className="w-12 h-12 text-slate-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No incidents yet
            </h3>
            <p className="text-slate-600">
              Incidents will appear here once news data is ingested.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => {
              const location = [incident.city, incident.state]
                .filter(Boolean)
                .join(", ");

              // Clean headline and summary to remove raw HTML/RSS content
              const cleanHeadline = stripHtmlAndPublisher(incident.headline) || incident.headline;
              const cleanSummary = cleanRssSnippet(incident.summary);

              return (
                <Link
                  key={incident.id}
                  href={`/incidents/${incident.slug}`}
                  className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-800 transition mb-2">
                        {cleanHeadline}
                      </h2>
                      {cleanSummary && (
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                          {cleanSummary}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        {location && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {incident.occurredAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {incident.sources.length > 0 && (
                          <span className="text-slate-400">
                            {incident.sources.length} source
                            {incident.sources.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 text-blue-800 text-sm font-medium group-hover:underline">
                        View Details
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">
            Were You Involved in an Accident?
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Get a free case evaluation from an experienced personal injury
            attorney in your area. No fees unless you win.
          </p>
          <Link
            href="/legal-help"
            className="inline-flex items-center gap-2 bg-white text-blue-800 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Talk to a Local Injury Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}
