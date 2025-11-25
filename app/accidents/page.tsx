import Link from "next/link";

// Mock data for all states
const STATES = [
  { abbr: "CO", name: "Colorado", slug: "co", accidents: 312, cities: ["Denver", "Aurora", "Boulder"] },
  { abbr: "CA", name: "California", slug: "ca", accidents: 1247, cities: ["Los Angeles", "San Francisco", "San Diego"] },
  { abbr: "TX", name: "Texas", slug: "tx", accidents: 892, cities: ["Houston", "Dallas", "Austin"] },
  { abbr: "FL", name: "Florida", slug: "fl", accidents: 756, cities: ["Miami", "Orlando", "Tampa"] },
  { abbr: "NY", name: "New York", slug: "ny", accidents: 623, cities: ["New York City", "Buffalo", "Albany"] },
  { abbr: "AZ", name: "Arizona", slug: "az", accidents: 445, cities: ["Phoenix", "Tucson", "Mesa"] },
];

// Mock recent incidents nationwide
const RECENT_INCIDENTS = [
  {
    id: "inc-001",
    title: "Two-Vehicle Collision on I-25 near Downtown Denver",
    slug: "i-25-two-vehicle-collision-downtown",
    state: "co",
    city: "denver",
    cityName: "Denver",
    stateAbbr: "CO",
    type: "Multi-vehicle",
    severity: "Injuries Reported",
    hoursAgo: 2,
  },
  {
    id: "inc-002",
    title: "Pedestrian Struck on Colfax Avenue",
    slug: "colfax-avenue-pedestrian-struck",
    state: "co",
    city: "denver",
    cityName: "Denver",
    stateAbbr: "CO",
    type: "Pedestrian",
    severity: "Serious Injuries",
    hoursAgo: 6,
  },
  {
    id: "inc-003",
    title: "Multi-Car Pileup on I-70 During Snowstorm",
    slug: "i-70-multi-car-pileup-snowstorm",
    state: "co",
    city: "aurora",
    cityName: "Aurora",
    stateAbbr: "CO",
    type: "Multi-vehicle",
    severity: "Multiple Injuries",
    hoursAgo: 24,
  },
  {
    id: "inc-004",
    title: "Motorcycle Crash on US-36",
    slug: "us-36-motorcycle-crash",
    state: "co",
    city: "boulder",
    cityName: "Boulder",
    stateAbbr: "CO",
    type: "Motorcycle",
    severity: "Fatality",
    hoursAgo: 28,
  },
];

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

export default function AccidentsIndexPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
            Traffic Accidents Across the US
          </h1>
          <p className="text-lg text-neutral-500 max-w-3xl mb-8 leading-relaxed">
            Browse recent traffic accidents by state and city. Find detailed reports about crashes in your area.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-3xl font-medium text-neutral-900">50</p>
              <p className="text-neutral-500 text-sm">States Covered</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-3xl font-medium text-neutral-900">4,275</p>
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
        {/* Browse by State */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-neutral-900 mb-6">Browse by State</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/accidents/${state.slug}`}
                className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#2A7D6E]/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-medium text-neutral-900">{state.abbr}</span>
                  <span className="bg-[#E8F5F2] text-[#2A7D6E] text-xs font-medium px-2 py-1 rounded-full">
                    {state.accidents}
                  </span>
                </div>
                <h3 className="font-medium text-neutral-700 text-sm mb-1">{state.name}</h3>
                <p className="text-xs text-neutral-500">{state.cities.slice(0, 2).join(", ")}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="text-[#2A7D6E] hover:text-[#236859] font-medium text-sm">
              View All 50 States →
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Recent Accidents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-neutral-900 mb-6">Latest Accidents Nationwide</h2>

            <div className="space-y-4">
              {RECENT_INCIDENTS.map((incident) => (
                <div
                  key={incident.id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className="text-neutral-500 text-sm">
                        {formatTimeAgo(incident.hoursAgo)}
                      </span>
                    </div>
                    <span className="bg-neutral-100 text-neutral-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {incident.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-neutral-900 mb-2 hover:text-[#2A7D6E] transition">
                    <Link href={`/accidents/${incident.state}/${incident.city}/${incident.slug}`}>
                      {incident.title}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <Link href={`/accidents/${incident.state}/${incident.city}`} className="hover:text-[#2A7D6E]">
                      {incident.cityName}, {incident.stateAbbr}
                    </Link>
                  </div>

                  <Link
                    href={`/accidents/${incident.state}/${incident.city}/${incident.slug}`}
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

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition font-medium">
                Load More Accidents
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Search CTA */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 mb-6">
              <h3 className="font-medium text-neutral-900 mb-3">Search Accidents</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Looking for a specific accident? Use our advanced search.
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
                We can help you obtain the official accident report.
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
                <strong>Disclaimer:</strong> Information is compiled from publicly available sources and may be incomplete. Details may change as investigations continue. Not an official record.
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
  description: "Browse recent traffic accidents across the US. Search by state, city, or date to find accident reports and crash information.",
};
