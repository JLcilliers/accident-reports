"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Mock incident data for MVP
const MOCK_INCIDENTS = [
  {
    id: "inc-001",
    title: "Two-Vehicle Collision on I-25 near Downtown Denver",
    slug: "i-25-two-vehicle-collision-downtown",
    city: "Denver",
    state: "CO",
    location: "I-25 Northbound at Exit 210",
    date: "2024-01-15",
    time: "3:45 PM",
    type: "Multi-vehicle",
    severity: "Injuries Reported",
    summary: "A two-vehicle collision was reported on I-25 northbound near the downtown exits. Injuries have been reported. Traffic is backed up for approximately 2 miles.",
    hoursAgo: 2,
  },
  {
    id: "inc-002",
    title: "Pedestrian Struck on Colfax Avenue",
    slug: "colfax-avenue-pedestrian-struck",
    city: "Denver",
    state: "CO",
    location: "E Colfax Ave & N Josephine St",
    date: "2024-01-15",
    time: "11:20 AM",
    type: "Pedestrian",
    severity: "Serious Injuries",
    summary: "A pedestrian was struck while crossing Colfax Avenue. The pedestrian was transported to a local hospital with serious injuries. The driver remained at the scene.",
    hoursAgo: 6,
  },
  {
    id: "inc-003",
    title: "Multi-Car Pileup on I-70 During Snowstorm",
    slug: "i-70-multi-car-pileup-snowstorm",
    city: "Aurora",
    state: "CO",
    location: "I-70 Eastbound Mile Marker 285",
    date: "2024-01-14",
    time: "7:30 AM",
    type: "Multi-vehicle",
    severity: "Multiple Injuries",
    summary: "A multi-car pileup involving at least 8 vehicles occurred during morning snowfall. Multiple injuries reported. Eastbound lanes were closed for several hours.",
    hoursAgo: 24,
  },
  {
    id: "inc-004",
    title: "Motorcycle Crash on US-36",
    slug: "us-36-motorcycle-crash",
    city: "Boulder",
    state: "CO",
    location: "US-36 near Foothills Parkway",
    date: "2024-01-14",
    time: "4:15 PM",
    type: "Motorcycle",
    severity: "Fatality",
    summary: "A fatal motorcycle crash occurred on US-36 near Foothills Parkway. The motorcyclist was pronounced dead at the scene. Investigation is ongoing.",
    hoursAgo: 28,
  },
  {
    id: "inc-005",
    title: "Rear-End Collision on Broadway",
    slug: "broadway-rear-end-collision",
    city: "Denver",
    state: "CO",
    location: "S Broadway & E Alameda Ave",
    date: "2024-01-13",
    time: "5:45 PM",
    type: "Rear-end",
    severity: "Minor Injuries",
    summary: "A rear-end collision occurred at the intersection of Broadway and Alameda. Minor injuries reported. Both vehicles were towed from the scene.",
    hoursAgo: 48,
  },
];

const INCIDENT_TYPES = [
  { value: "", label: "All Types" },
  { value: "multi-vehicle", label: "Multi-vehicle" },
  { value: "pedestrian", label: "Pedestrian" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "rear-end", label: "Rear-end" },
  { value: "bicycle", label: "Bicycle" },
];

const SEVERITY_LEVELS = [
  { value: "", label: "All Severities" },
  { value: "minor", label: "Minor Injuries" },
  { value: "injuries", label: "Injuries Reported" },
  { value: "serious", label: "Serious Injuries" },
  { value: "fatality", label: "Fatality" },
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [filters, setFilters] = useState({
    type: "",
    severity: "",
  });

  // Get search params
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const date = searchParams.get("date") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";

  useEffect(() => {
    // Filter incidents based on search params (mock filtering)
    let filtered = MOCK_INCIDENTS;

    if (city) {
      filtered = filtered.filter(inc =>
        inc.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (state) {
      filtered = filtered.filter(inc =>
        inc.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (filters.type) {
      filtered = filtered.filter(inc =>
        inc.type.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    setIncidents(filtered);
  }, [city, state, date, filters]);

  const formatTimeAgo = (hours: number) => {
    if (hours < 24) return `${hours} hours ago`;
    if (hours < 48) return "Yesterday";
    return `${Math.floor(hours / 24)} days ago`;
  };

  const getSeverityColor = (severity: string) => {
    if (severity.includes("Fatal")) return "bg-red-100 text-red-800";
    if (severity.includes("Serious")) return "bg-orange-100 text-orange-800";
    if (severity.includes("Minor")) return "bg-yellow-100 text-yellow-800";
    return "bg-amber-100 text-amber-800";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Accident Search Results
          </h1>
          <p className="text-slate-600">
            {city || state ? (
              <>Showing accidents {city && `in ${city}`}{city && state && ", "}{state && state}</>
            ) : firstName || lastName ? (
              <>Searching for incidents involving: {firstName} {lastName}</>
            ) : (
              <>Showing all recent accidents</>
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters</h2>

              {/* Incident Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Incident Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {INCIDENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Severity
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SEVERITY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ type: "", severity: "" })}
                className="w-full text-blue-800 hover:text-blue-900 text-sm font-medium py-2"
              >
                Clear All Filters
              </button>
            </div>

            {/* Disclaimer Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Information is based on publicly available sources and may be incomplete. Details may change as investigations continue. This is not official record.
              </p>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-slate-900">{incidents.length}</span> incidents found
              </p>
              <select className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Most Recent</option>
                <option>Oldest First</option>
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
                      <Link href={`/accidents/${incident.state.toLowerCase()}/${incident.city.toLowerCase()}/${incident.slug}`}>
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

                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {incident.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/accidents/${incident.state.toLowerCase()}/${incident.city.toLowerCase()}/${incident.slug}`}
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
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Results Found</h3>
                <p className="text-slate-600 mb-4">
                  We couldn&apos;t find any accidents matching your search criteria.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-900 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Try a Different Search
                </Link>
              </div>
            )}

            {/* Pagination placeholder */}
            {incidents.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium disabled:opacity-50" disabled>
                  Previous
                </button>
                <span className="px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-lg">1</span>
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium">
                  2
                </button>
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium">
                  3
                </button>
                <button className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
