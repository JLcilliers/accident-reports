import Link from "next/link";
import { notFound } from "next/navigation";

// Mock state data
const STATE_DATA: Record<string, {
  name: string;
  abbr: string;
  totalAccidents: number;
  lastWeek: number;
  fatalities: number;
  description: string;
  cities: Array<{
    slug: string;
    name: string;
    accidents: number;
    recent: number;
  }>;
}> = {
  co: {
    name: "Colorado",
    abbr: "CO",
    totalAccidents: 15420,
    lastWeek: 312,
    fatalities: 156,
    description: "Colorado sees significant traffic incidents along its major interstate corridors including I-25, I-70, and I-76. Mountain highways and weather conditions contribute to seasonal variations in accident rates.",
    cities: [
      { slug: "denver", name: "Denver", accidents: 847, recent: 23 },
      { slug: "aurora", name: "Aurora", accidents: 412, recent: 11 },
      { slug: "boulder", name: "Boulder", accidents: 156, recent: 4 },
      { slug: "colorado-springs", name: "Colorado Springs", accidents: 523, recent: 15 },
      { slug: "fort-collins", name: "Fort Collins", accidents: 198, recent: 6 },
      { slug: "lakewood", name: "Lakewood", accidents: 187, recent: 5 },
    ],
  },
};

// Mock recent incidents for the state
const STATE_INCIDENTS = [
  {
    id: "inc-001",
    title: "Two-Vehicle Collision on I-25 near Downtown Denver",
    slug: "i-25-two-vehicle-collision-downtown",
    city: "denver",
    cityName: "Denver",
    location: "I-25 Northbound at Exit 210",
    date: "2024-01-15",
    time: "3:45 PM",
    type: "Multi-vehicle",
    severity: "Injuries Reported",
    hoursAgo: 2,
  },
  {
    id: "inc-002",
    title: "Pedestrian Struck on Colfax Avenue",
    slug: "colfax-avenue-pedestrian-struck",
    city: "denver",
    cityName: "Denver",
    location: "E Colfax Ave & N Josephine St",
    date: "2024-01-15",
    time: "11:20 AM",
    type: "Pedestrian",
    severity: "Serious Injuries",
    hoursAgo: 6,
  },
  {
    id: "inc-003",
    title: "Multi-Car Pileup on I-70 During Snowstorm",
    slug: "i-70-multi-car-pileup-snowstorm",
    city: "aurora",
    cityName: "Aurora",
    location: "I-70 Eastbound Mile Marker 285",
    date: "2024-01-14",
    time: "7:30 AM",
    type: "Multi-vehicle",
    severity: "Multiple Injuries",
    hoursAgo: 24,
  },
  {
    id: "inc-004",
    title: "Motorcycle Crash on US-36",
    slug: "us-36-motorcycle-crash",
    city: "boulder",
    cityName: "Boulder",
    location: "US-36 near Foothills Parkway",
    date: "2024-01-14",
    time: "4:15 PM",
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

export default async function StateAccidentsPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = STATE_DATA[state];

  if (!stateData) {
    notFound();
  }

  return (
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
            <span className="text-neutral-900 font-medium">{stateData.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
            Traffic Accidents in {stateData.name}
          </h1>
          <p className="text-lg text-neutral-500 max-w-3xl mb-8 leading-relaxed">
            {stateData.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">This Year</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.totalAccidents.toLocaleString()}</p>
              <p className="text-neutral-500 text-xs">Total Accidents</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">Last 7 Days</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.lastWeek}</p>
              <p className="text-neutral-500 text-xs">New Reports</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">Year to Date</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.fatalities}</p>
              <p className="text-neutral-500 text-xs">Fatalities</p>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
              <p className="text-neutral-500 text-sm mb-1">Major Cities</p>
              <p className="text-3xl font-medium text-neutral-900">{stateData.cities.length}</p>
              <p className="text-neutral-500 text-xs">Covered</p>
            </div>
          </div>
        </div>
        {/* Cities Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-neutral-900 mb-6">Browse by City</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stateData.cities.map((city) => (
              <Link
                key={city.slug}
                href={`/accidents/${state}/${city.slug}`}
                className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#2A7D6E]/30 transition-all duration-300 text-center"
              >
                <h3 className="font-medium text-neutral-900 mb-1">{city.name}</h3>
                <p className="text-sm text-neutral-600">{city.recent} this week</p>
                <p className="text-xs text-neutral-500 mt-1">{city.accidents} total</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Recent Incidents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-neutral-900 mb-6">Recent Accidents in {stateData.name}</h2>

            <div className="space-y-4">
              {STATE_INCIDENTS.map((incident) => (
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
                    <Link href={`/accidents/${state}/${incident.city}/${incident.slug}`}>
                      {incident.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {incident.cityName} - {incident.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {incident.date} at {incident.time}
                    </span>
                  </div>

                  <Link
                    href={`/accidents/${state}/${incident.city}/${incident.slug}`}
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
                href={`/search?state=${state}`}
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition font-medium"
              >
                View All {stateData.name} Accidents
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Legal Help CTA */}
            <div className="bg-neutral-900 rounded-2xl p-6 text-white mb-6">
              <h3 className="text-lg font-medium mb-3">Injured in a {stateData.name} Accident?</h3>
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
                Looking for a specific accident in {stateData.name}?
              </p>
              <Link
                href={`/search?state=${state.toUpperCase()}`}
                className="block w-full bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition font-medium text-center text-sm"
              >
                Search {stateData.name} Accidents
              </Link>
            </div>

            {/* Major Highways */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 mb-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-4 uppercase tracking-wide">Major Highways</h3>
              <div className="space-y-2">
                <Link href={`/search?state=${state}&road=i-25`} className="block text-[#2A7D6E] hover:text-[#236859] text-sm hover:underline">
                  I-25 Accidents
                </Link>
                <Link href={`/search?state=${state}&road=i-70`} className="block text-[#2A7D6E] hover:text-[#236859] text-sm hover:underline">
                  I-70 Accidents
                </Link>
                <Link href={`/search?state=${state}&road=i-76`} className="block text-[#2A7D6E] hover:text-[#236859] text-sm hover:underline">
                  I-76 Accidents
                </Link>
                <Link href={`/search?state=${state}&road=us-36`} className="block text-[#2A7D6E] hover:text-[#236859] text-sm hover:underline">
                  US-36 Accidents
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Statistics are based on publicly available data and may not represent all accidents. For official statistics, contact CDOT or local law enforcement.
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
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = STATE_DATA[state];

  if (!stateData) {
    return {
      title: "State Not Found | AccidentLookup",
    };
  }

  return {
    title: `${stateData.name} Traffic Accidents Today | AccidentLookup`,
    description: `View recent traffic accidents in ${stateData.name}. Search accident reports by city, find crash locations, and get legal help.`,
  };
}
