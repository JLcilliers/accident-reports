import Link from "next/link";
import { notFound } from "next/navigation";
import { stripHtmlAndPublisher } from "@/lib/text";

// Mock data for city-level accidents
const CITY_DATA: Record<string, {
  city: string;
  state: string;
  stateAbbr: string;
  population: string;
  totalAccidents: number;
  lastWeek: number;
  fatalities: number;
  description: string;
}> = {
  denver: {
    city: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    population: "715,522",
    totalAccidents: 847,
    lastWeek: 23,
    fatalities: 12,
    description: "Denver, the capital of Colorado, sees significant traffic incidents along major corridors including I-25, I-70, and busy arterials like Colfax Avenue and Broadway.",
  },
  aurora: {
    city: "Aurora",
    state: "Colorado",
    stateAbbr: "CO",
    population: "386,261",
    totalAccidents: 412,
    lastWeek: 11,
    fatalities: 5,
    description: "Aurora is Colorado's third-largest city with major traffic corridors including I-70, I-225, and E-470. The city sees frequent accidents along these busy highways.",
  },
  boulder: {
    city: "Boulder",
    state: "Colorado",
    stateAbbr: "CO",
    population: "105,485",
    totalAccidents: 156,
    lastWeek: 4,
    fatalities: 2,
    description: "Boulder sits along US-36 with connections to Denver and the mountains. The city sees accidents along major roads including Broadway, 28th Street, and Foothills Parkway.",
  },
};

// Mock incidents for each city
const CITY_INCIDENTS: Record<string, Array<{
  id: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  type: string;
  severity: string;
  summary: string;
  hoursAgo: number;
}>> = {
  denver: [
    {
      id: "inc-001",
      title: "Two-Vehicle Collision on I-25 near Downtown Denver",
      slug: "i-25-two-vehicle-collision-downtown",
      location: "I-25 Northbound at Exit 210",
      date: "2024-01-15",
      time: "3:45 PM",
      type: "Multi-vehicle",
      severity: "Injuries Reported",
      summary: "A two-vehicle collision was reported on I-25 northbound near the downtown exits. Injuries have been reported.",
      hoursAgo: 2,
    },
    {
      id: "inc-002",
      title: "Pedestrian Struck on Colfax Avenue",
      slug: "colfax-avenue-pedestrian-struck",
      location: "E Colfax Ave & N Josephine St",
      date: "2024-01-15",
      time: "11:20 AM",
      type: "Pedestrian",
      severity: "Serious Injuries",
      summary: "A pedestrian was struck while crossing Colfax Avenue. The pedestrian was transported to a local hospital with serious injuries.",
      hoursAgo: 6,
    },
    {
      id: "inc-005",
      title: "Rear-End Collision on Broadway",
      slug: "broadway-rear-end-collision",
      location: "S Broadway & E Alameda Ave",
      date: "2024-01-13",
      time: "5:45 PM",
      type: "Rear-end",
      severity: "Minor Injuries",
      summary: "A rear-end collision occurred at the intersection of Broadway and Alameda. Minor injuries reported.",
      hoursAgo: 48,
    },
  ],
  aurora: [
    {
      id: "inc-003",
      title: "Multi-Car Pileup on I-70 During Snowstorm",
      slug: "i-70-multi-car-pileup-snowstorm",
      location: "I-70 Eastbound Mile Marker 285",
      date: "2024-01-14",
      time: "7:30 AM",
      type: "Multi-vehicle",
      severity: "Multiple Injuries",
      summary: "A multi-car pileup involving at least 8 vehicles occurred during morning snowfall. Multiple injuries reported.",
      hoursAgo: 24,
    },
  ],
  boulder: [
    {
      id: "inc-004",
      title: "Motorcycle Crash on US-36",
      slug: "us-36-motorcycle-crash",
      location: "US-36 near Foothills Parkway",
      date: "2024-01-14",
      time: "4:15 PM",
      type: "Motorcycle",
      severity: "Fatality",
      summary: "A fatal motorcycle crash occurred on US-36 near Foothills Parkway. The motorcyclist was pronounced dead at the scene.",
      hoursAgo: 28,
    },
  ],
};

function getSeverityColor(severity: string) {
  if (severity.includes("Fatal")) return "bg-red-100 text-red-800";
  if (severity.includes("Serious")) return "bg-orange-100 text-orange-800";
  if (severity.includes("Minor")) return "bg-yellow-100 text-yellow-800";
  return "bg-amber-100 text-amber-800";
}

function formatTimeAgo(hours: number) {
  if (hours < 24) return `${hours} hours ago`;
  if (hours < 48) return "Yesterday";
  return `${Math.floor(hours / 24)} days ago`;
}

export default async function CityAccidentsPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const cityData = CITY_DATA[city];
  const incidents = CITY_INCIDENTS[city] || [];

  if (!cityData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/accidents" className="hover:text-white transition">Accidents</Link>
            <span>/</span>
            <Link href={`/accidents/${state}`} className="hover:text-white transition">{cityData.state}</Link>
            <span>/</span>
            <span className="text-white font-medium">{cityData.city}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Recent Accidents in {cityData.city}, {cityData.stateAbbr}
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mb-8">
            {cityData.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-blue-200 text-sm mb-1">This Year</p>
              <p className="text-2xl font-bold text-white">{cityData.totalAccidents}</p>
              <p className="text-blue-200 text-xs">Total Accidents</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-blue-200 text-sm mb-1">Last 7 Days</p>
              <p className="text-2xl font-bold text-white">{cityData.lastWeek}</p>
              <p className="text-blue-200 text-xs">New Reports</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-blue-200 text-sm mb-1">Year to Date</p>
              <p className="text-2xl font-bold text-white">{cityData.fatalities}</p>
              <p className="text-blue-200 text-xs">Fatalities</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-blue-200 text-sm mb-1">Population</p>
              <p className="text-2xl font-bold text-white">{cityData.population}</p>
              <p className="text-blue-200 text-xs">Residents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">{incidents.length}</span> recent accidents in {cityData.city}
              </p>
              <select className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Most Recent</option>
                <option>Oldest First</option>
                <option>Most Severe</option>
              </select>
            </div>

            {/* Incident Cards */}
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {formatTimeAgo(incident.hoursAgo)}
                        </span>
                      </div>
                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {incident.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-blue-800 transition">
                      <Link href={`/accidents/${state}/${city}/${incident.slug}`}>
                        {incident.title}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {incident.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {incident.date} at {incident.time}
                      </span>
                    </div>

                    {(() => {
                      const cleanSummary = stripHtmlAndPublisher(incident.summary);
                      return cleanSummary ? (
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          {cleanSummary}
                        </p>
                      ) : null;
                    })()}

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/accidents/${state}/${city}/${incident.slug}`}
                        className="text-blue-800 hover:text-blue-900 font-medium text-sm flex items-center gap-1"
                      >
                        View Full Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                      </Link>
                      <Link
                        href="/legal-help"
                        className="text-slate-600 hover:text-slate-800 text-sm"
                      >
                        Get Legal Help
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Recent Accidents</h3>
                <p className="text-slate-600 mb-4">
                  We haven&apos;t recorded any accidents in {cityData.city} recently.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-900 font-medium"
                >
                  Search All Accidents
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </Link>
              </div>
            )}

            {/* Pagination */}
            {incidents.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium disabled:opacity-50" disabled>
                  Previous
                </button>
                <span className="px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-lg">1</span>
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium">
                  2
                </button>
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Legal Help CTA */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-3">Involved in an Accident in {cityData.city}?</h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Get a free case evaluation from an experienced personal injury attorney. No fees unless you win.
              </p>
              <Link
                href="/legal-help"
                className="block w-full bg-white text-blue-800 px-4 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-center text-sm"
              >
                Get Free Legal Consultation
              </Link>
            </div>

            {/* Nearby Cities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Nearby Cities</h3>
              <div className="space-y-2">
                {Object.entries(CITY_DATA)
                  .filter(([key]) => key !== city)
                  .map(([key, data]) => (
                    <Link
                      key={key}
                      href={`/accidents/${state}/${key}`}
                      className="flex items-center justify-between py-2 text-slate-700 hover:text-blue-800 transition"
                    >
                      <span className="text-sm">{data.city}, {data.stateAbbr}</span>
                      <span className="text-xs text-slate-500">{data.lastWeek} this week</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Common Roads */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">High-Traffic Roads</h3>
              <div className="space-y-2">
                {cityData.city === "Denver" && (
                  <>
                    <Link href={`/accidents/${state}/${city}?road=i-25`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      I-25 Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=i-70`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      I-70 Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=colfax`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      Colfax Avenue Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=broadway`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      Broadway Accidents
                    </Link>
                  </>
                )}
                {cityData.city === "Aurora" && (
                  <>
                    <Link href={`/accidents/${state}/${city}?road=i-70`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      I-70 Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=i-225`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      I-225 Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=e-470`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      E-470 Accidents
                    </Link>
                  </>
                )}
                {cityData.city === "Boulder" && (
                  <>
                    <Link href={`/accidents/${state}/${city}?road=us-36`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      US-36 Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=broadway`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      Broadway Accidents
                    </Link>
                    <Link href={`/accidents/${state}/${city}?road=28th-street`} className="block text-blue-800 hover:text-blue-900 text-sm hover:underline">
                      28th Street Accidents
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Search Accidents</h3>
              <p className="text-slate-600 text-sm mb-4">
                Looking for a specific accident? Search our database.
              </p>
              <Link
                href="/search"
                className="block w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition font-medium text-center text-sm"
              >
                Search Accidents
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Statistics are based on publicly available data and may not represent all accidents. For official statistics, contact local law enforcement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { city } = await params;
  const cityData = CITY_DATA[city];

  if (!cityData) {
    return {
      title: "City Not Found | AccidentLookup",
    };
  }

  return {
    title: `${cityData.city}, ${cityData.stateAbbr} Accidents Today | AccidentLookup`,
    description: `View recent traffic accidents in ${cityData.city}, ${cityData.state}. Find accident reports, crash locations, and injury information.`,
  };
}
