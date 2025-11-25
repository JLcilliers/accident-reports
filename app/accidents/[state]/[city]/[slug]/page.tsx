import Link from "next/link";
import { notFound } from "next/navigation";

// Mock incident data - in production this would come from a database/API
const MOCK_INCIDENTS: Record<string, {
  id: string;
  title: string;
  city: string;
  state: string;
  stateAbbr: string;
  location: string;
  date: string;
  time: string;
  type: string;
  severity: string;
  summary: string;
  details: {
    whatWeKnow: string[];
    whatWeDontKnow: string[];
    vehiclesInvolved: number;
    injuries: string;
    roadConditions: string;
    weatherConditions: string;
    respondingAgencies: string[];
  };
  lastUpdated: string;
}> = {
  "i-25-two-vehicle-collision-downtown": {
    id: "inc-001",
    title: "Two-Vehicle Collision on I-25 near Downtown Denver",
    city: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    location: "I-25 Northbound at Exit 210",
    date: "January 15, 2024",
    time: "3:45 PM",
    type: "Multi-vehicle",
    severity: "Injuries Reported",
    summary: "A two-vehicle collision was reported on I-25 northbound near the downtown exits. Injuries have been reported. Traffic is backed up for approximately 2 miles.",
    details: {
      whatWeKnow: [
        "The collision occurred at approximately 3:45 PM on January 15, 2024",
        "Two vehicles were involved in the crash on I-25 northbound",
        "The incident occurred near Exit 210, close to downtown Denver",
        "At least one person was transported to a local hospital with injuries",
        "Traffic was backed up for approximately 2 miles following the collision",
        "Colorado State Patrol responded to the scene",
      ],
      whatWeDontKnow: [
        "The exact cause of the collision is still under investigation",
        "The total number of people injured has not been confirmed",
        "The severity of injuries has not been officially released",
        "Whether any citations were issued",
        "The identities of those involved",
      ],
      vehiclesInvolved: 2,
      injuries: "At least 1 person transported to hospital",
      roadConditions: "Dry pavement",
      weatherConditions: "Clear skies",
      respondingAgencies: ["Colorado State Patrol", "Denver Fire Department", "Denver Health Paramedics"],
    },
    lastUpdated: "January 15, 2024 at 6:30 PM",
  },
  "colfax-avenue-pedestrian-struck": {
    id: "inc-002",
    title: "Pedestrian Struck on Colfax Avenue",
    city: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    location: "E Colfax Ave & N Josephine St",
    date: "January 15, 2024",
    time: "11:20 AM",
    type: "Pedestrian",
    severity: "Serious Injuries",
    summary: "A pedestrian was struck while crossing Colfax Avenue. The pedestrian was transported to a local hospital with serious injuries. The driver remained at the scene.",
    details: {
      whatWeKnow: [
        "A pedestrian was struck at the intersection of E Colfax Ave and N Josephine St",
        "The incident occurred at approximately 11:20 AM on January 15, 2024",
        "The pedestrian sustained serious injuries and was transported to a local hospital",
        "The driver remained at the scene and is cooperating with investigators",
        "Denver Police Department is investigating the crash",
      ],
      whatWeDontKnow: [
        "Whether the pedestrian was in a crosswalk at the time of the collision",
        "The current condition of the pedestrian",
        "Whether the driver will face any charges",
        "What factors may have contributed to the crash",
      ],
      vehiclesInvolved: 1,
      injuries: "1 pedestrian with serious injuries",
      roadConditions: "Dry pavement",
      weatherConditions: "Overcast",
      respondingAgencies: ["Denver Police Department", "Denver Fire Department", "Denver Health Paramedics"],
    },
    lastUpdated: "January 15, 2024 at 2:15 PM",
  },
  "i-70-multi-car-pileup-snowstorm": {
    id: "inc-003",
    title: "Multi-Car Pileup on I-70 During Snowstorm",
    city: "Aurora",
    state: "Colorado",
    stateAbbr: "CO",
    location: "I-70 Eastbound Mile Marker 285",
    date: "January 14, 2024",
    time: "7:30 AM",
    type: "Multi-vehicle",
    severity: "Multiple Injuries",
    summary: "A multi-car pileup involving at least 8 vehicles occurred during morning snowfall. Multiple injuries reported. Eastbound lanes were closed for several hours.",
    details: {
      whatWeKnow: [
        "At least 8 vehicles were involved in the pileup",
        "The incident occurred during heavy snowfall on the morning of January 14, 2024",
        "Multiple people were transported to area hospitals with various injuries",
        "I-70 eastbound lanes were closed for approximately 4 hours",
        "Icy road conditions are believed to be a contributing factor",
        "Multiple emergency agencies responded to the scene",
      ],
      whatWeDontKnow: [
        "The exact number of vehicles involved (reports vary from 8 to 12)",
        "The total number of people injured",
        "Whether any injuries are life-threatening",
        "The initial cause of the chain reaction collision",
      ],
      vehiclesInvolved: 8,
      injuries: "Multiple people transported with various injuries",
      roadConditions: "Snow and ice covered",
      weatherConditions: "Heavy snowfall, reduced visibility",
      respondingAgencies: ["Colorado State Patrol", "Aurora Fire Department", "Aurora Police Department", "CDOT"],
    },
    lastUpdated: "January 14, 2024 at 3:45 PM",
  },
  "us-36-motorcycle-crash": {
    id: "inc-004",
    title: "Motorcycle Crash on US-36",
    city: "Boulder",
    state: "Colorado",
    stateAbbr: "CO",
    location: "US-36 near Foothills Parkway",
    date: "January 14, 2024",
    time: "4:15 PM",
    type: "Motorcycle",
    severity: "Fatality",
    summary: "A fatal motorcycle crash occurred on US-36 near Foothills Parkway. The motorcyclist was pronounced dead at the scene. Investigation is ongoing.",
    details: {
      whatWeKnow: [
        "A single motorcycle was involved in the crash",
        "The incident occurred at approximately 4:15 PM on January 14, 2024",
        "The motorcyclist was pronounced dead at the scene",
        "The crash occurred on US-36 near Foothills Parkway in Boulder",
        "Boulder County Coroner's Office will release the identity after next of kin notification",
      ],
      whatWeDontKnow: [
        "The identity of the motorcyclist (pending notification)",
        "What caused the crash",
        "Whether any other vehicles were involved",
        "Whether speed or other factors played a role",
      ],
      vehiclesInvolved: 1,
      injuries: "1 fatality",
      roadConditions: "Dry pavement",
      weatherConditions: "Clear and sunny",
      respondingAgencies: ["Boulder Police Department", "Boulder Fire Department", "Boulder County Coroner"],
    },
    lastUpdated: "January 14, 2024 at 8:00 PM",
  },
  "broadway-rear-end-collision": {
    id: "inc-005",
    title: "Rear-End Collision on Broadway",
    city: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    location: "S Broadway & E Alameda Ave",
    date: "January 13, 2024",
    time: "5:45 PM",
    type: "Rear-end",
    severity: "Minor Injuries",
    summary: "A rear-end collision occurred at the intersection of Broadway and Alameda. Minor injuries reported. Both vehicles were towed from the scene.",
    details: {
      whatWeKnow: [
        "Two vehicles were involved in a rear-end collision",
        "The crash occurred at the intersection of S Broadway and E Alameda Ave",
        "Minor injuries were reported; one person was evaluated at the scene",
        "Both vehicles sustained significant damage and were towed",
        "The incident occurred during rush hour traffic",
      ],
      whatWeDontKnow: [
        "Whether any citations were issued",
        "The exact circumstances leading to the collision",
        "Whether distracted driving was a factor",
      ],
      vehiclesInvolved: 2,
      injuries: "Minor injuries, 1 person evaluated at scene",
      roadConditions: "Dry pavement",
      weatherConditions: "Clear",
      respondingAgencies: ["Denver Police Department", "Denver Fire Department"],
    },
    lastUpdated: "January 13, 2024 at 7:30 PM",
  },
};

function getSeverityColor(severity: string) {
  if (severity.includes("Fatal")) return "bg-red-100 text-red-800 border-red-200";
  if (severity.includes("Serious")) return "bg-orange-100 text-orange-800 border-orange-200";
  if (severity.includes("Minor")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ state: string; city: string; slug: string }>;
}) {
  const { state, city, slug } = await params;
  const incident = MOCK_INCIDENTS[slug];

  if (!incident) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-800 transition">Home</Link>
            <span>/</span>
            <Link href="/accidents" className="hover:text-blue-800 transition">Accidents</Link>
            <span>/</span>
            <Link href={`/accidents/${state}`} className="hover:text-blue-800 transition capitalize">
              {incident.state}
            </Link>
            <span>/</span>
            <Link href={`/accidents/${state}/${city}`} className="hover:text-blue-800 transition capitalize">
              {incident.city}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{incident.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
                  {incident.type}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {incident.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {incident.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {incident.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {incident.time}
                </span>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Incident Summary</h2>
              <p className="text-slate-700 leading-relaxed">{incident.summary}</p>
            </div>

            {/* What We Know */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                What We Know So Far
              </h2>
              <ul className="space-y-3">
                {incident.details.whatWeKnow.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Don't Know */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                What We Don&apos;t Know Yet
              </h2>
              <ul className="space-y-3">
                {incident.details.whatWeDontKnow.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Incident Details Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Incident Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Vehicles Involved</p>
                  <p className="text-slate-900 font-semibold">{incident.details.vehiclesInvolved}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Injuries</p>
                  <p className="text-slate-900 font-semibold">{incident.details.injuries}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Road Conditions</p>
                  <p className="text-slate-900 font-semibold">{incident.details.roadConditions}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Weather</p>
                  <p className="text-slate-900 font-semibold">{incident.details.weatherConditions}</p>
                </div>
              </div>
              <div className="mt-4 bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Responding Agencies</p>
                <div className="flex flex-wrap gap-2">
                  {incident.details.respondingAgencies.map((agency, index) => (
                    <span key={index} className="bg-white text-slate-700 text-sm px-3 py-1 rounded-full border border-slate-200">
                      {agency}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* What To Do Section */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                What to Do if You Were Involved
              </h2>
              <ol className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <span><strong>Seek medical attention</strong> – Even if you feel fine, some injuries may not be immediately apparent.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <span><strong>Document everything</strong> – Take photos, gather witness information, and keep all medical records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <span><strong>Get a copy of the police report</strong> – This is crucial for insurance claims and any legal action.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <span><strong>Don&apos;t speak to insurance adjusters</strong> without understanding your rights first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">5</span>
                  <span><strong>Consider consulting an attorney</strong> – Many offer free consultations to review your case.</span>
                </li>
              </ol>
            </div>

            {/* Getting Your Report */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Getting Your Police/Accident Report
              </h2>
              <p className="text-slate-700 mb-4">
                If you were involved in this accident, you&apos;ll need a copy of the official police report for your insurance claim or legal case. Reports are typically available within 5-10 business days after the incident.
              </p>
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Get Your Police Report
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Disclaimer:</strong> This information is compiled from publicly available sources including police reports, news media, and official statements. Details may be incomplete or change as investigations continue. This is not an official record. For official information, contact the responding law enforcement agency.
              </p>
              <p className="text-amber-700 text-xs mt-2">
                Last updated: {incident.lastUpdated}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Legal Help CTA Card */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6 sticky top-24">
              <h3 className="text-lg font-bold mb-3">Were You Involved in This Crash?</h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Get a free case evaluation from an experienced personal injury attorney in your area. No fees unless you win.
              </p>
              <Link
                href="/legal-help"
                className="block w-full bg-white text-blue-800 px-4 py-3 rounded-lg hover:bg-blue-50 transition font-semibold text-center text-sm"
              >
                Talk to a Local Injury Lawyer
              </Link>
              <div className="flex items-center gap-2 mt-4 text-blue-200 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span>Free & Confidential</span>
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Location</span>
                  <span className="text-slate-900 font-medium">{incident.city}, {incident.stateAbbr}</span>
                </div>
                <div className="border-t border-slate-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Date</span>
                  <span className="text-slate-900 font-medium">{incident.date}</span>
                </div>
                <div className="border-t border-slate-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Time</span>
                  <span className="text-slate-900 font-medium">{incident.time}</span>
                </div>
                <div className="border-t border-slate-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Type</span>
                  <span className="text-slate-900 font-medium">{incident.type}</span>
                </div>
                <div className="border-t border-slate-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Vehicles</span>
                  <span className="text-slate-900 font-medium">{incident.details.vehiclesInvolved}</span>
                </div>
              </div>
            </div>

            {/* Related Searches */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Related Searches</h3>
              <div className="space-y-2">
                <Link
                  href={`/accidents/${state}/${city}`}
                  className="block text-blue-800 hover:text-blue-900 text-sm hover:underline"
                >
                  More accidents in {incident.city}
                </Link>
                <Link
                  href={`/accidents/${state}`}
                  className="block text-blue-800 hover:text-blue-900 text-sm hover:underline"
                >
                  Accidents in {incident.state}
                </Link>
                <Link
                  href={`/search?type=${incident.type.toLowerCase()}`}
                  className="block text-blue-800 hover:text-blue-900 text-sm hover:underline"
                >
                  Other {incident.type.toLowerCase()} accidents
                </Link>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Share This Report</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition text-sm font-medium">
                  Copy Link
                </button>
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition text-sm font-medium">
                  Print
                </button>
              </div>
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
  params: Promise<{ state: string; city: string; slug: string }>;
}) {
  const { slug } = await params;
  const incident = MOCK_INCIDENTS[slug];

  if (!incident) {
    return {
      title: "Accident Not Found | AccidentLookup",
    };
  }

  return {
    title: `${incident.title} | AccidentLookup`,
    description: incident.summary,
  };
}
