import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const revalidate = 600; // Re-generate every 10 minutes

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";

// State abbreviation to full name mapping
const STATE_NAMES: Record<string, string> = {
  al: "Alabama", ak: "Alaska", az: "Arizona", ar: "Arkansas", ca: "California",
  co: "Colorado", ct: "Connecticut", de: "Delaware", fl: "Florida", ga: "Georgia",
  hi: "Hawaii", id: "Idaho", il: "Illinois", in: "Indiana", ia: "Iowa",
  ks: "Kansas", ky: "Kentucky", la: "Louisiana", me: "Maine", md: "Maryland",
  ma: "Massachusetts", mi: "Michigan", mn: "Minnesota", ms: "Mississippi", mo: "Missouri",
  mt: "Montana", ne: "Nebraska", nv: "Nevada", nh: "New Hampshire", nj: "New Jersey",
  nm: "New Mexico", ny: "New York", nc: "North Carolina", nd: "North Dakota", oh: "Ohio",
  ok: "Oklahoma", or: "Oregon", pa: "Pennsylvania", ri: "Rhode Island", sc: "South Carolina",
  sd: "South Dakota", tn: "Tennessee", tx: "Texas", ut: "Utah", vt: "Vermont",
  va: "Virginia", wa: "Washington", wv: "West Virginia", wi: "Wisconsin", wy: "Wyoming",
  dc: "District of Columbia",
};

async function getStateData(stateCode: string) {
  const stateUpper = stateCode.toUpperCase();

  try {
    // Get total incidents for this state
    const totalIncidents = await prisma.incident.count({
      where: { state: stateUpper },
    });

    // If no incidents, return null
    if (totalIncidents === 0) {
      return null;
    }

    // Get incidents from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const lastWeek = await prisma.incident.count({
      where: {
        state: stateUpper,
        occurredAt: { gte: sevenDaysAgo },
      },
    });

    // Get city breakdown
    const cityData = await prisma.incident.groupBy({
      by: ["city"],
      _count: { id: true },
      where: {
        state: stateUpper,
        city: { not: null },
      },
      orderBy: { _count: { id: "desc" } },
      take: 12,
    });

    // Get recent incidents
    const recentIncidents = await prisma.incident.findMany({
      where: { state: stateUpper },
      orderBy: { occurredAt: "desc" },
      take: 10,
      include: { sources: true },
    });

    return {
      stateCode: stateUpper,
      stateName: STATE_NAMES[stateCode.toLowerCase()] || stateCode,
      totalIncidents,
      lastWeek,
      cityData,
      recentIncidents,
    };
  } catch (error) {
    console.error(`[accidents/${stateCode}] Failed to fetch state data:`, error);
    return null;
  }
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

export default async function StateAccidentsPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = await getStateData(state);

  if (!stateData) {
    notFound();
  }

  // JSON-LD FAQPage structured data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long does it take for a crash report to be available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Processing times vary by agency, but it often takes several days to a few weeks before a crash report is available for request. Some statewide records can take up to a few months to appear in the driver record system.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a report if it was a minor accident?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Even for minor crashes, an official report can be important for insurance claims and protecting your rights if injuries or vehicle damage turn out to be more serious than they first appeared.",
        },
      },
      {
        "@type": "Question",
        name: "Can this website give me the official report?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. We help you understand which agency likely has your report and how to request it. Official copies are only available from government agencies such as the state patrol, local police departments, sheriff's offices, or the state DMV.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-[#F7F7F7]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
            <Link href="/" className="hover:text-neutral-600 transition">Home</Link>
            <span>/</span>
            <Link href="/accidents" className="hover:text-neutral-600 transition">Accidents</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{stateData.stateName}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
            Traffic Accidents in {stateData.stateName}
          </h1>
          <p className="text-lg text-neutral-500 max-w-3xl mb-8 leading-relaxed">
            Browse recent traffic accidents in {stateData.stateName} compiled from publicly available news sources.
            Find detailed reports about crashes by city and understand your options if you were involved.
          </p>

          {/* Stats Grid - Real data only */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">Total Tracked</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.totalIncidents.toLocaleString()}</p>
              <p className="text-neutral-500 text-xs">Accidents</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">Last 7 Days</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.lastWeek}</p>
              <p className="text-neutral-500 text-xs">New Reports</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">Cities</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.cityData.length}</p>
              <p className="text-neutral-500 text-xs">With Data</p>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        {stateData.cityData.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-medium text-neutral-900 mb-6">Browse by City</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stateData.cityData.map((city) => (
                <Link
                  key={city.city}
                  href={`/accidents/${state}/${city.city?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#2A7D6E]/30 transition-all duration-300 text-center"
                >
                  <h3 className="font-medium text-neutral-900 mb-1">{city.city}</h3>
                  <p className="text-sm text-neutral-600">{city._count.id} accidents</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Recent Incidents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-neutral-900 mb-6">Recent Accidents in {stateData.stateName}</h2>

            <div className="space-y-4">
              {stateData.recentIncidents.map((incident) => (
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

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {[incident.city, incident.state].filter(Boolean).join(", ")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {incident.occurredAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/incidents/${incident.slug}`}
                    className="text-[#2A7D6E] hover:text-[#236859] font-medium text-sm flex items-center gap-1"
                  >
                    View Full Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            {/* View More */}
            <div className="text-center mt-8">
              <Link
                href="/incidents"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition font-medium"
              >
                View All {stateData.stateName} Accidents
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>

            {/* SEO Content - State-specific guidance */}
            <div className="mt-12 space-y-8">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xl font-medium text-neutral-900 mb-4">
                  How to Get an Official {stateData.stateName} Crash Report
                </h2>
                <div className="prose prose-neutral max-w-none text-neutral-600 space-y-4">
                  <p className="leading-relaxed">
                    If you were involved in a crash in {stateData.stateName}, your official crash report is
                    typically kept by either the state highway patrol, the local police department or
                    sheriff&apos;s office that responded, or the state&apos;s Department of Motor Vehicles.
                  </p>

                  <h3 className="text-lg font-medium text-neutral-800 mt-6 mb-2">
                    1. Crashes on Highways and State Roads
                  </h3>
                  <p className="leading-relaxed">
                    For crashes handled on highways and state roads, you can usually request a basic crash
                    report through the state patrol&apos;s central records unit. You&apos;ll need the driver name,
                    crash date, case number, and crash location. Requests may take several business days to process.
                  </p>

                  <h3 className="text-lg font-medium text-neutral-800 mt-6 mb-2">
                    2. Crashes Inside Cities and Counties
                  </h3>
                  <p className="leading-relaxed">
                    If your crash happened inside city or county limits, the local police department or
                    sheriff&apos;s office is usually the custodian of the report. Most agencies allow you
                    to request reports online, in person, or by mail, and they charge a small fee.
                  </p>

                  <h3 className="text-lg font-medium text-neutral-800 mt-6 mb-2">
                    3. State DMV Records
                  </h3>
                  <p className="leading-relaxed">
                    The state Department of Motor Vehicles or equivalent agency maintains statewide crash
                    records for driver-history purposes. Processing can take several weeks as reports
                    are entered into the state system.
                  </p>

                  <p className="text-sm text-neutral-500 mt-6 leading-relaxed">
                    This site is not affiliated with any state patrol, department of motor vehicles, or
                    local law-enforcement agency. We provide general guidance and summaries only. Always
                    use the official state or local portals to request certified copies of crash reports.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xl font-medium text-neutral-900 mb-4">
                  {stateData.stateName} Accident Report FAQs
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-2">
                      How long does it take for a crash report to be available?
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Processing times vary by agency, but it often takes several days to a few weeks
                      before a crash report is available for request. Some statewide records can take
                      up to a few months to appear in the driver record system, especially if the
                      crash was recently reported.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-800 mb-2">
                      Do I need a report if it was a minor accident?
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Even for minor crashes, an official report can be important for insurance claims
                      and protecting your rights if injuries or vehicle damage turn out to be more
                      serious than they first appeared.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-800 mb-2">
                      Can this website give me the official report?
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      No. We help you understand which agency likely has your report and how to request
                      it. Official copies are only available from government agencies such as the state
                      patrol, local police departments, sheriff&apos;s offices, or the state DMV.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xl font-medium text-neutral-900 mb-4">About Our {stateData.stateName} Coverage</h2>
                <div className="prose prose-neutral max-w-none text-neutral-600">
                  <p className="leading-relaxed">
                    This page currently shows a selection of recent {stateData.stateName} traffic accidents
                    from publicly available news sources. It is not a complete list of all crashes in
                    the state. We track {stateData.totalIncidents.toLocaleString()} incidents
                    across {stateData.cityData.length} cities in {stateData.stateName}.
                  </p>
                  <p className="leading-relaxed mt-4">
                    Our data comes from news reports and public announcements. For official statewide
                    statistics, contact your state&apos;s Department of Transportation or highway safety office.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Legal Help CTA */}
            <div className="bg-neutral-900 rounded-2xl p-6 text-white mb-6">
              <h3 className="text-lg font-medium mb-3">Injured in a {stateData.stateName} Accident?</h3>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                Get a free case evaluation from an experienced personal injury attorney. No fees unless you win.
              </p>
              <Link
                href="/legal-help"
                className="block w-full bg-[#2A7D6E] text-white px-4 py-3 rounded-xl hover:bg-[#236859] transition font-medium text-center text-sm"
              >
                Get Free Legal Consultation
              </Link>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wide">Search Accidents</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Looking for a specific accident in {stateData.stateName}?
              </p>
              <Link
                href="/search"
                className="block w-full bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition font-medium text-center text-sm"
              >
                Search {stateData.stateName} Accidents
              </Link>
            </div>

            {/* Get Report CTA */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wide">Need Your Report?</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Learn how to obtain the official accident report from your local agency.
              </p>
              <Link
                href="/get-report/step-1"
                className="block w-full bg-[#2A7D6E] text-white px-4 py-3 rounded-xl hover:bg-[#236859] transition font-medium text-center text-sm"
              >
                Get Your Police Report
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Information is based on publicly available data and
                may not represent all accidents. For official statistics, contact the state
                Department of Transportation or local law enforcement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateName = STATE_NAMES[state.toLowerCase()] || state.toUpperCase();

  return {
    title: `${stateName} Traffic Accidents Today | AccidentLookup`,
    description: `View recent traffic accidents in ${stateName}. Search accident reports by city, find crash locations, and learn how to get your official police report.`,
  };
}
