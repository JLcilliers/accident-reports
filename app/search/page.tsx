import Link from "next/link";
import prisma from "@/lib/prisma";
import { buildLocationInfo, type ExtractedFactsInput } from "@/lib/location";
import { SearchFilters } from "./SearchFilters";

export const revalidate = 60; // Re-generate every minute

// State abbreviation to full name mapping
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

interface SearchParams {
  q?: string;
  state?: string;
  dateRange?: string;
  page?: string;
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffHours < 48) return "Yesterday";
  return `${Math.floor(diffHours / 24)} days ago`;
}

// Get date filter based on dateRange param
function getDateFilter(dateRange: string | undefined) {
  const now = new Date();

  switch (dateRange) {
    case "today":
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { gte: todayStart };
    case "week":
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { gte: weekAgo };
    case "month":
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { gte: monthAgo };
    case "3months":
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return { gte: threeMonthsAgo };
    default:
      return undefined;
  }
}

async function searchIncidents(params: SearchParams) {
  const { q, state, dateRange, page = "1" } = params;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const perPage = 12;
  const skip = (pageNum - 1) * perPage;

  // Build the where clause
  const where: Record<string, unknown> = {};

  // Text search (headline, city, state)
  if (q && q.trim()) {
    const searchTerm = q.trim();
    where.OR = [
      { headline: { contains: searchTerm, mode: "insensitive" } },
      { city: { contains: searchTerm, mode: "insensitive" } },
      { state: { contains: searchTerm, mode: "insensitive" } },
      { summary: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // State filter
  if (state && state.trim()) {
    where.state = { equals: state.toUpperCase(), mode: "insensitive" };
  }

  // Date range filter
  const dateFilter = getDateFilter(dateRange);
  if (dateFilter) {
    where.occurredAt = dateFilter;
  }

  try {
    // Get incidents and total count in parallel
    const [incidents, totalCount] = await Promise.all([
      prisma.incident.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        skip,
        take: perPage,
        select: {
          id: true,
          slug: true,
          headline: true,
          summary: true,
          city: true,
          state: true,
          occurredAt: true,
          extractedFacts: true,
          sources: {
            select: { id: true },
          },
        },
      }),
      prisma.incident.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return {
      incidents,
      totalCount,
      currentPage: pageNum,
      totalPages,
      perPage,
    };
  } catch (error) {
    console.error("[search] Failed to search incidents:", error);
    return {
      incidents: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      perPage,
    };
  }
}

// Get available states for the filter dropdown
async function getAvailableStates() {
  try {
    const states = await prisma.incident.groupBy({
      by: ["state"],
      where: { state: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    return states.filter(s => s.state).map(s => ({
      code: s.state!,
      name: STATE_NAMES[s.state!] || s.state!,
      count: s._count.id,
    }));
  } catch (error) {
    console.error("[search] Failed to get states:", error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [results, availableStates] = await Promise.all([
    searchIncidents(params),
    getAvailableStates(),
  ]);

  const { q, state, dateRange } = params;
  const hasFilters = !!(q || state || dateRange);

  // Build search description
  let searchDescription = "Showing all recent accidents";
  if (hasFilters) {
    const parts: string[] = [];
    if (q) parts.push(`matching "${q}"`);
    if (state) parts.push(`in ${STATE_NAMES[state.toUpperCase()] || state}`);
    if (dateRange === "today") parts.push("from today");
    else if (dateRange === "week") parts.push("from the past week");
    else if (dateRange === "month") parts.push("from the past month");
    else if (dateRange === "3months") parts.push("from the past 3 months");
    searchDescription = parts.length ? `Showing accidents ${parts.join(" ")}` : "Showing all recent accidents";
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1200px] py-6 sm:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Accident Search
          </h1>
          <p className="text-neutral-600">{searchDescription}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1200px] py-4">
          <SearchFilters
            availableStates={availableStates}
            currentQuery={q || ""}
            currentState={state || ""}
            currentDateRange={dateRange || ""}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1200px] py-6 sm:py-8">
        <div className="md:grid md:grid-cols-4 md:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 mb-6 md:mb-0">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Results</h2>
              <p className="text-3xl font-medium text-neutral-900">{results.totalCount.toLocaleString()}</p>
              <p className="text-neutral-500 text-sm">incidents found</p>
            </div>

            {/* Browse by State */}
            {availableStates.length > 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-4">
                <h3 className="font-semibold text-neutral-900 mb-3">Browse by State</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {availableStates.slice(0, 10).map((s) => (
                    <Link
                      key={s.code}
                      href={`/search?state=${s.code}`}
                      className={`flex items-center justify-between py-1.5 px-2 rounded text-sm transition-colors ${
                        state?.toUpperCase() === s.code
                          ? "bg-[#E8F5F2] text-[#2A7D6E] font-medium"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{s.name}</span>
                      <span className="text-xs text-neutral-400">{s.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Information is based on publicly available sources and may be incomplete. Details may change as investigations continue. This is not an official record.
              </p>
            </div>
          </div>

          {/* Results List */}
          <div className="md:col-span-3">
            {/* Results Count & Sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-neutral-600 text-sm">
                Page <span className="font-semibold text-neutral-900">{results.currentPage}</span> of{" "}
                <span className="font-semibold text-neutral-900">{results.totalPages || 1}</span>
              </p>
            </div>

            {/* Incident Cards */}
            {results.incidents.length > 0 ? (
              <div className="space-y-4">
                {results.incidents.map((incident) => {
                  const locationInfo = buildLocationInfo({
                    extractedFacts: incident.extractedFacts as ExtractedFactsInput | null,
                    dbCity: incident.city,
                    dbState: incident.state,
                  });

                  return (
                    <div
                      key={incident.id}
                      className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            Traffic Incident
                          </span>
                          <span className="text-neutral-500 text-sm">
                            {formatTimeAgo(incident.occurredAt)}
                          </span>
                        </div>
                        {incident.sources.length > 1 && (
                          <span className="bg-neutral-100 text-neutral-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {incident.sources.length} sources
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 hover:text-[#2A7D6E] transition">
                        <Link href={`/incidents/${incident.slug}`}>{incident.headline}</Link>
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                        <span className="flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-neutral-400"
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
                          {locationInfo.displayLocation}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {incident.occurredAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {incident.summary && (
                        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {incident.summary}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <Link
                          href={`/incidents/${incident.slug}`}
                          className="text-[#2A7D6E] hover:text-[#236859] font-medium text-sm flex items-center gap-1"
                        >
                          View Full Details
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link href="/legal-help" className="text-neutral-500 hover:text-neutral-700 text-sm">
                          Get Legal Help
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                <svg
                  className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Results Found</h3>
                <p className="text-neutral-600 mb-4">
                  We couldn&apos;t find any accidents matching your search criteria.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 text-[#2A7D6E] hover:text-[#236859] font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Clear Search & View All
                </Link>
              </div>
            )}

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {results.currentPage > 1 && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(state ? { state } : {}),
                      ...(dateRange ? { dateRange } : {}),
                      page: String(results.currentPage - 1),
                    }).toString()}`}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-800 text-sm font-medium"
                  >
                    Previous
                  </Link>
                )}

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, results.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(results.currentPage - 2, results.totalPages - 4)) + i;
                  if (pageNum > results.totalPages) return null;
                  return (
                    <Link
                      key={pageNum}
                      href={`/search?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(state ? { state } : {}),
                        ...(dateRange ? { dateRange } : {}),
                        page: String(pageNum),
                      }).toString()}`}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        pageNum === results.currentPage
                          ? "bg-[#2A7D6E] text-white"
                          : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {results.currentPage < results.totalPages && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(state ? { state } : {}),
                      ...(dateRange ? { dateRange } : {}),
                      page: String(results.currentPage + 1),
                    }).toString()}`}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-800 text-sm font-medium"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Search Accidents | AccidentLookup",
  description:
    "Search for traffic accidents by location, date, or keyword. Find accident reports and crash information compiled from public news sources.",
};
