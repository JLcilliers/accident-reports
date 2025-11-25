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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Accidents</span>
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Traffic Accidents Across the US
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mb-8">
            Browse recent traffic accidents by state and city. Find detailed reports about crashes in your area.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold text-white">50</p>
              <p className="text-blue-200 text-sm">States Covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold text-white">4,275</p>
              <p className="text-blue-200 text-sm">This Week</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-blue-200 text-sm">Updated</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-2xl font-bold text-white">Free</p>
              <p className="text-blue-200 text-sm">To Search</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8">
        {/* Browse by State */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Browse by State</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/accidents/${state.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-slate-900">{state.abbr}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {state.accidents}
                  </span>
                </div>
                <h3 className="font-medium text-slate-700 text-sm mb-1">{state.name}</h3>
                <p className="text-xs text-slate-500">{state.cities.slice(0, 2).join(", ")}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="text-blue-800 hover:text-blue-900 font-medium text-sm">
              View All 50 States →
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Recent Accidents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Latest Accidents Nationwide</h2>

            <div className="space-y-4">
              {RECENT_INCIDENTS.map((incident) => (
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
                    <Link href={`/accidents/${incident.state}/${incident.city}/${incident.slug}`}>
                      {incident.title}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <Link href={`/accidents/${incident.state}/${incident.city}`} className="hover:text-blue-800">
                      {incident.cityName}, {incident.stateAbbr}
                    </Link>
                  </div>

                  <Link
                    href={`/accidents/${incident.state}/${incident.city}/${incident.slug}`}
                    className="text-blue-800 hover:text-blue-900 font-medium text-sm flex items-center gap-1"
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
              <button className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition font-medium">
                Load More Accidents
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Search CTA */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Search Accidents</h3>
              <p className="text-slate-600 text-sm mb-4">
                Looking for a specific accident? Use our advanced search.
              </p>
              <Link
                href="/search"
                className="block w-full bg-blue-800 text-white px-4 py-2.5 rounded-lg hover:bg-blue-900 transition font-medium text-center text-sm"
              >
                Search Accidents
              </Link>
            </div>

            {/* Legal Help CTA */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-3">Were You in an Accident?</h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Get a free case evaluation from an experienced personal injury attorney near you.
              </p>
              <Link
                href="/legal-help"
                className="block w-full bg-white text-blue-800 px-4 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-center text-sm"
              >
                Get Free Legal Help
              </Link>
            </div>

            {/* Get Report CTA */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Need Your Police Report?</h3>
              <p className="text-slate-600 text-sm mb-4">
                We can help you obtain the official accident report.
              </p>
              <Link
                href="/get-report/step-1"
                className="block w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition font-medium text-center text-sm"
              >
                Get Your Report
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
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
