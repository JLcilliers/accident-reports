import Link from "next/link";
import prisma from "@/lib/prisma";
import { buildLocationInfo, type ExtractedFactsInput } from "@/lib/location";

export const revalidate = 600; // Re-generate every 10 minutes

// Fetch real statistics from the database
async function getAccidentStats() {
  try {
    // Get total incident count
    const totalIncidents = await prisma.incident.count();

    // Get incidents from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thisWeek = await prisma.incident.count({
      where: { occurredAt: { gte: sevenDaysAgo } },
    });

    // Get state breakdown (only states with data)
    const stateData = await prisma.incident.groupBy({
      by: ["state"],
      _count: { id: true },
      where: { state: { not: null } },
      orderBy: { _count: { id: "desc" } },
    });

    // Get recent incidents for display
    const recentIncidents = await prisma.incident.findMany({
      orderBy: { occurredAt: "desc" },
      take: 8,
      select: {
        id: true,
        slug: true,
        headline: true,
        city: true,
        state: true,
        occurredAt: true,
        extractedFacts: true,
        sources: {
          select: { id: true },
        },
      },
    });

    return {
      totalIncidents,
      thisWeek,
      stateData,
      recentIncidents,
      statesWithData: stateData.length,
    };
  } catch (error) {
    console.error("[accidents] Failed to fetch stats:", error);
    return {
      totalIncidents: 0,
      thisWeek: 0,
      stateData: [],
      recentIncidents: [],
      statesWithData: 0,
    };
  }
}

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

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffHours < 48) return "Yesterday";
  return `${Math.floor(diffHours / 24)} days ago`;
}

export default async function AccidentsIndexPage() {
  const stats = await getAccidentStats();

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
            Traffic Accidents Across the US
          </h1>
          <p className="text-lg text-neutral-500 max-w-3xl mb-8 leading-relaxed">
            Browse recent traffic accidents by state and city. Find detailed reports about crashes in your area compiled from publicly available news sources.
          </p>

          {/* Quick Stats - Real data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-3xl font-medium text-neutral-900">{stats.statesWithData}</p>
              <p className="text-neutral-500 text-sm">States Covered</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-3xl font-medium text-neutral-900">{stats.thisWeek.toLocaleString()}</p>
              <p className="text-neutral-500 text-sm">This Week</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-3xl font-medium text-neutral-900">24/7</p>
              <p className="text-neutral-500 text-sm">Updated</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-3xl font-medium text-neutral-900">Free</p>
              <p className="text-neutral-500 text-sm">To Search</p>
            </div>
          </div>
        </div>

        {/* Browse by State - Only show states with actual data */}
        {stats.stateData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-medium text-neutral-900 mb-6">Browse by State</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.stateData.slice(0, 12).map((state) => (
                <Link
                  key={state.state}
                  href={`/accidents/${state.state?.toLowerCase()}`}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#2A7D6E]/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-medium text-neutral-900">{state.state}</span>
                    <span className="bg-[#E8F5F2] text-[#2A7D6E] text-xs font-medium px-2 py-1 rounded-full">
                      {state._count.id}
                    </span>
                  </div>
                  <h3 className="font-medium text-neutral-700 text-sm mb-1">
                    {STATE_NAMES[state.state || ""] || state.state}
                  </h3>
                  <p className="text-xs text-neutral-500">View accidents</p>
                </Link>
              ))}
            </div>
            {stats.stateData.length > 12 && (
              <div className="text-center mt-6">
                <span className="text-neutral-500 text-sm">
                  Plus {stats.stateData.length - 12} more states
                </span>
              </div>
            )}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Recent Accidents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-neutral-900 mb-6">Latest Accidents Nationwide</h2>

            {stats.recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {stats.recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
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

                    <h3 className="text-lg font-medium text-neutral-900 mb-2 hover:text-[#2A7D6E] transition">
                      <Link href={`/incidents/${incident.slug}`}>
                        {incident.headline}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>
                        {buildLocationInfo({
                          extractedFacts: incident.extractedFacts as ExtractedFactsInput | null,
                          dbCity: incident.city,
                          dbState: incident.state,
                        }).displayLocation}
                      </span>
                    </div>

                    <Link
                      href={`/incidents/${incident.slug}`}
                      className="text-[#2A7D6E] hover:text-[#236859] font-medium text-sm flex items-center gap-1"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 text-center">
                <p className="text-neutral-600">No accidents found. Check back soon as we update our database daily.</p>
              </div>
            )}

            {/* Load More */}
            {stats.recentIncidents.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  href="/incidents"
                  className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition font-medium"
                >
                  View All Accidents
                </Link>
              </div>
            )}

            {/* SEO Content Section */}
            <div className="mt-12 space-y-8">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xl font-medium text-neutral-900 mb-4">Where Our Accident Information Comes From</h2>
                <div className="prose prose-neutral max-w-none text-neutral-600">
                  <p className="mb-4 leading-relaxed">
                    AccidentLookup monitors publicly available sources such as local news outlets,
                    public announcements, and law-enforcement press releases to identify traffic
                    accidents that may be relevant to you. We then organize that information by
                    state, city, and road so you can quickly see what happened and where.
                  </p>
                  <p className="leading-relaxed">
                    This site is not a government agency or law firm. We don&apos;t create or
                    control official crash records. Instead, we summarize what has been reported
                    publicly and link you to the agencies that can provide the official police
                    or crash report.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xl font-medium text-neutral-900 mb-4">What You Can Do Here</h2>
                <div className="prose prose-neutral max-w-none text-neutral-600">
                  <p className="mb-4 leading-relaxed">
                    You can use this site to locate traffic accidents near you, understand the
                    basic facts of a crash, and learn how to request the official police report.
                    If you were injured, we can also connect you with personal injury lawyers
                    who handle these cases every day.
                  </p>
                  <p className="leading-relaxed">
                    Because we rely on public information, some details may be missing or updated
                    later. Always confirm critical information directly with the law-enforcement
                    agency that handled the crash.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xl font-medium text-neutral-900 mb-4">Current Coverage and Expansion</h2>
                <div className="prose prose-neutral max-w-none text-neutral-600">
                  <p className="leading-relaxed">
                    We&apos;re actively expanding our coverage across the United States. Currently,
                    we have detailed accident information for {stats.statesWithData} state{stats.statesWithData !== 1 ? "s" : ""} with
                    {stats.totalIncidents > 0 ? ` ${stats.totalIncidents.toLocaleString()} incidents tracked` : " more data added daily"}.
                    If you don&apos;t see your state or city yet, it means we don&apos;t have enough
                    verified information to publish accurate reports there. We add new regions as
                    more data sources come online.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Search CTA */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 mb-6">
              <h3 className="font-medium text-neutral-900 mb-3">Search Accidents</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Looking for a specific accident? Use our search tool.
              </p>
              <Link
                href="/search"
                className="block w-full bg-[#2A7D6E] text-white px-4 py-3 rounded-xl hover:bg-[#236859] transition font-medium text-center text-sm"
              >
                Search Accidents
              </Link>
            </div>

            {/* Legal Help CTA */}
            <div className="bg-neutral-900 rounded-2xl p-6 text-white mb-6">
              <h3 className="text-lg font-medium mb-3">Were You in an Accident?</h3>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                Get a free case evaluation from an experienced personal injury attorney near you.
              </p>
              <Link
                href="/legal-help"
                className="block w-full bg-[#2A7D6E] text-white px-4 py-3 rounded-xl hover:bg-[#236859] transition font-medium text-center text-sm"
              >
                Get Free Legal Help
              </Link>
            </div>

            {/* Get Report CTA */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 mb-6">
              <h3 className="font-medium text-neutral-900 mb-3">Need Your Police Report?</h3>
              <p className="text-neutral-600 text-sm mb-4">
                We can help you understand how to obtain the official accident report from your local agency.
              </p>
              <Link
                href="/get-report/step-1"
                className="block w-full bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition font-medium text-center text-sm"
              >
                Get Your Report
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Information is compiled from publicly available sources and may be incomplete. Details may change as investigations continue. This is not an official record. For official records, contact local law enforcement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Traffic Accidents Today | AccidentLookup",
  description: "Browse recent traffic accidents across the US. Search by state, city, or date to find accident reports and crash information compiled from public news sources.",
};
