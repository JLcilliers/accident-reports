import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import prisma from "@/lib/prisma";
import { stripHtmlAndPublisher, cleanRssSnippet, getHostname } from "@/lib/text";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

export const revalidate = 600; // Re-generate every 10 minutes

// Build a proper paragraph summary from incident data
function buildIncidentSummary(incident: {
  headline: string;
  summary?: string | null;
  city?: string | null;
  state?: string | null;
  occurredAt: Date;
}): string {
  // Try to clean the DB summary first
  const cleanedFromDb = stripHtmlAndPublisher(incident.summary);
  const cleanedHeadline = stripHtmlAndPublisher(incident.headline) ?? incident.headline;

  const location =
    incident.city && incident.state
      ? `${incident.city}, ${incident.state}`
      : incident.state
        ? incident.state
        : "this area";

  const date = incident.occurredAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (cleanedFromDb && cleanedFromDb.length > 60) {
    // We have a usable summary — wrap it in context
    return `${cleanedFromDb} This incident was reported in ${location} on ${date}, based on information from publicly available news sources. Details may be updated as more information is released.`;
  }

  // No usable summary, fall back to headline + context
  return `${cleanedHeadline}. This incident involves a reported traffic crash in ${location} on ${date}, as described in public news coverage. Exact details may be limited in initial reports.`;
}

async function getIncident(slug: string) {
  return prisma.incident.findUnique({
    where: { slug },
    include: { sources: true },
  });
}

export async function generateStaticParams() {
  // Pre-render most recent incidents at build time
  // Return empty array if database is not available (e.g., during initial build)
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { occurredAt: "desc" },
      take: 500,
      select: { slug: true },
    });

    return incidents.map((incident) => ({ slug: incident.slug }));
  } catch {
    // Database not available during build - pages will be generated on-demand
    console.log("[incidents/[slug]] Database not available during build, using ISR");
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const incident = await getIncident(slug);

  if (!incident) {
    return {
      title: "Incident Not Found | AccidentReports",
    };
  }

  const location = [incident.city, incident.state].filter(Boolean).join(", ");

  // Use SEO-optimized fields if available, otherwise fall back to defaults
  const title = incident.seoTitle || `${incident.headline} | AccidentReports`;
  const description =
    incident.seoDescription ||
    incident.summary?.slice(0, 155) ||
    `Accident report for ${location} on ${incident.occurredAt.toDateString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: incident.occurredAt.toISOString(),
      modifiedTime: (incident.updatedAt ?? incident.occurredAt).toISOString(),
    },
  };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const incident = await getIncident(slug);

  if (!incident) {
    return notFound();
  }

  // Extract facts early so we can use them for location
  const extractedFacts = incident.extractedFacts as AccidentFacts | null;

  // Build location string with priority: extractedFacts.primaryLocation > city/state > roads > fallback
  const buildLocation = (): string => {
    // First priority: extracted primary location (most specific, e.g., "Near Exit 23 on I-240 in Memphis, Tennessee")
    if (extractedFacts?.primaryLocation) {
      return extractedFacts.primaryLocation;
    }

    // Second priority: city and state from database
    const cityState = [incident.city, incident.state].filter(Boolean).join(", ");
    if (cityState) {
      // Enhance with roads if available
      if (extractedFacts?.roads && extractedFacts.roads.length > 0) {
        return `${extractedFacts.roads[0]}, ${cityState}`;
      }
      return cityState;
    }

    // Third priority: just roads if available
    if (extractedFacts?.roads && extractedFacts.roads.length > 0) {
      const state = extractedFacts.state || "";
      const city = extractedFacts.city || "";
      const cityStateFromFacts = [city, state].filter(Boolean).join(", ");
      if (cityStateFromFacts) {
        return `${extractedFacts.roads[0]}, ${cityStateFromFacts}`;
      }
      return extractedFacts.roads.join(", ");
    }

    // Fourth priority: city/state from extracted facts
    const factsLocation = [extractedFacts?.city, extractedFacts?.state].filter(Boolean).join(", ");
    if (factsLocation) {
      return factsLocation;
    }

    // Last resort
    return "Location not specified";
  };

  const location = buildLocation();

  const formattedDate = incident.occurredAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const cleanedHeadline = stripHtmlAndPublisher(incident.headline) ?? incident.headline;

  // JSON-LD NewsArticle structured data
  const seoHeadline = incident.seoTitle || incident.headline;
  const seoDescription =
    incident.seoDescription || incident.summary || `Traffic accident report for ${location}`;

  // Build about entities from extracted facts (companies, agencies, vehicles)
  const aboutEntities: { "@type": string; name: string }[] = [];
  if (extractedFacts?.companiesMentioned) {
    extractedFacts.companiesMentioned.forEach((company) => {
      aboutEntities.push({ "@type": "Organization", name: company });
    });
  }
  if (extractedFacts?.agenciesInvolved) {
    extractedFacts.agenciesInvolved.forEach((agency) => {
      aboutEntities.push({ "@type": "GovernmentOrganization", name: agency });
    });
  }
  if (extractedFacts?.vehicles) {
    extractedFacts.vehicles.forEach((vehicle) => {
      const vehicleName = vehicle.ownerCompany
        ? `${vehicle.type} (${vehicle.ownerCompany})`
        : vehicle.type;
      aboutEntities.push({ "@type": "Vehicle", name: vehicleName });
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: seoHeadline,
    description: seoDescription,
    articleBody: incident.articleBody || undefined,
    datePublished: incident.occurredAt.toISOString(),
    dateModified: (incident.updatedAt ?? incident.occurredAt).toISOString(),
    author: {
      "@type": "Organization",
      name: "AccidentReports",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AccidentReports",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/incidents/${incident.slug}`,
    },
    ...(incident.city && incident.state
      ? {
          contentLocation: {
            "@type": "Place",
            name: extractedFacts?.primaryLocation || location,
            address: {
              "@type": "PostalAddress",
              addressLocality: incident.city,
              addressRegion: incident.state,
              addressCountry: "US",
            },
          },
        }
      : {}),
    ...(aboutEntities.length > 0 ? { about: aboutEntities } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-800 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/accidents" className="hover:text-blue-800 transition">
              Accidents
            </Link>
            {incident.state && (
              <>
                <span>/</span>
                <Link
                  href={`/accidents/${incident.state.toLowerCase()}`}
                  className="hover:text-blue-800 transition"
                >
                  {incident.state}
                </Link>
              </>
            )}
            {incident.city && (
              <>
                <span>/</span>
                <span className="text-slate-900 font-medium">{incident.city}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8 pb-32 sm:pb-32">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-sm font-semibold px-3 py-1 rounded-full">
                  Traffic Incident
                </span>
                {incident.sources.length > 1 && (
                  <span className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">
                    {incident.sources.length} Sources
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                {cleanedHeadline}
              </h1>
              <p className="text-sm text-slate-500 mb-4">
                {location} • {formattedDate} • Traffic accident summary from public news sources
              </p>
              <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-slate-400"
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
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-slate-400"
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
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Incident Summary
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-normal break-words">
                {buildIncidentSummary(incident)}
              </p>
            </div>

            {/* Full Incident Overview (SEO Article) */}
            {incident.articleBody && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-0 prose-h2:mb-4 prose-ul:my-3 prose-li:my-1 prose-p:my-3 prose-strong:text-slate-800">
                  <ReactMarkdown>{incident.articleBody}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Key Details from Public Reports */}
            {(() => {
              const facts = incident.extractedFacts as AccidentFacts | null;
              return (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Key Details from Public Reports
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <span className="font-medium">Location:</span>{" "}
                      {facts?.primaryLocation ||
                        (incident.city && incident.state
                          ? `${incident.city}, ${incident.state}`
                          : incident.state ?? "Not specified in reports")}
                    </li>
                    {facts?.roads && facts.roads.length > 0 && (
                      <li>
                        <span className="font-medium">Roads/Highways:</span>{" "}
                        {facts.roads.join(", ")}
                      </li>
                    )}
                    <li>
                      <span className="font-medium">Date of crash:</span>{" "}
                      {formattedDate}
                      {facts?.timeOfCrashApprox && ` (${facts.timeOfCrashApprox})`}
                    </li>
                    {facts?.vehicles && facts.vehicles.length > 0 && (
                      <li>
                        <span className="font-medium">Vehicles involved:</span>{" "}
                        {facts.vehicles
                          .map((v) =>
                            v.ownerCompany ? `${v.type} (${v.ownerCompany})` : v.type
                          )
                          .join(", ")}
                      </li>
                    )}
                    {facts?.injuriesCount && (
                      <li>
                        <span className="font-medium">Injuries:</span>{" "}
                        {facts.injuriesCount}
                      </li>
                    )}
                    {facts?.fatalitiesCount && (
                      <li>
                        <span className="font-medium">Fatalities:</span>{" "}
                        {facts.fatalitiesCount}
                      </li>
                    )}
                    {facts?.agenciesInvolved && facts.agenciesInvolved.length > 0 && (
                      <li>
                        <span className="font-medium">Responding agencies:</span>{" "}
                        {facts.agenciesInvolved.join(", ")}
                      </li>
                    )}
                    {facts?.companiesMentioned && facts.companiesMentioned.length > 0 && (
                      <li>
                        <span className="font-medium">Companies involved:</span>{" "}
                        {facts.companiesMentioned.join(", ")}
                      </li>
                    )}
                    <li>
                      <span className="font-medium">Number of news sources:</span>{" "}
                      {incident.sources.length}
                    </li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-3">
                    These details are taken from publicly available news coverage and may not
                    include every fact in the official police report.
                  </p>
                </div>
              );
            })()}

            {/* News Sources */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                News Coverage
              </h2>
              <ul className="space-y-4">
                {incident.sources.map((source) => {
                  const snippet = cleanRssSnippet(source.snippet);
                  return (
                    <li
                      key={source.id}
                      className="border-l-2 border-slate-200 pl-4 hover:border-blue-500 transition-colors"
                    >
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <h3 className="text-slate-900 font-medium group-hover:text-blue-800 transition break-words">
                          {source.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <svg
                            className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                          </svg>
                          <span className="truncate">
                            {source.publisher || getHostname(source.url)}
                          </span>
                          <span>•</span>
                          <span className="flex-shrink-0">
                            {source.publishedAt.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {snippet && (
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2 break-words">
                            {snippet}
                          </p>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* What To Do Section */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                What to Do if You Were Involved
              </h2>
              <ol className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </span>
                  <span>
                    <strong>Seek medical attention</strong> – Even if you feel fine,
                    some injuries may not be immediately apparent.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </span>
                  <span>
                    <strong>Document everything</strong> – Take photos, gather
                    witness information, and keep all medical records.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </span>
                  <span>
                    <strong>Get a copy of the police report</strong> – This is
                    crucial for insurance claims and any legal action.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </span>
                  <span>
                    <strong>Don&apos;t speak to insurance adjusters</strong>{" "}
                    without understanding your rights first.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    5
                  </span>
                  <span>
                    <strong>Consider consulting an attorney</strong> – Many offer
                    free consultations to review your case.
                  </span>
                </li>
              </ol>
            </div>

            {/* Getting Your Report */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Getting Your Police/Accident Report
              </h2>
              <p className="text-slate-700 mb-4">
                If you were involved in this accident, you&apos;ll usually need a copy of
                the official police report for your insurance claim or legal case.
                Reports are typically available within 5-10 business days after the
                incident.
              </p>
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition font-medium text-sm"
              >
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Get Your Police Report
              </Link>
            </div>

            {/* Why the Accident Report Is Important */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Why the Accident Report Is Important
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700">
                <p className="mb-4 leading-relaxed">
                  The official accident report documents key facts about the crash&mdash;who
                  was involved, where and when it happened, the officer&apos;s determination
                  of fault, and witness statements. Insurance companies rely on it to process
                  claims, and attorneys use it to build cases for injured victims.
                </p>
                <p className="mb-4 leading-relaxed">
                  Without this report, proving fault becomes significantly harder. If you
                  were a driver, passenger, or pedestrian involved in this incident, obtaining
                  your copy should be a top priority. Most jurisdictions release reports within
                  5&ndash;14 business days after the crash, though complex investigations can
                  take longer.
                </p>
                <p className="leading-relaxed">
                  Even if you don&apos;t plan to file a lawsuit, having the official record
                  protects you if the other party&apos;s insurance tries to dispute your
                  account or deny coverage. It&apos;s your best evidence of what actually
                  happened.
                </p>
              </div>
            </div>

            {/* How to Use This Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                How to Use This Information
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Use this page to confirm basic details about the crash and understand which
                agencies are likely to have the official report. If you were involved or
                lost a family member in this incident, consider requesting the full report
                and speaking with a qualified attorney before making any major decisions
                about insurance or legal claims.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Disclaimer:</strong> This information is compiled from
                publicly available news sources. It may be incomplete or updated
                later as investigations continue. This is not an official record.
                For official records, contact the law-enforcement agency that
                handled the crash.
              </p>
              <p className="text-amber-700 text-xs mt-2">
                Last updated:{" "}
                {incident.updatedAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {incident.updatedAt.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Facts Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
                Quick Facts
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Location</span>
                  <span className="text-slate-900 font-medium">{location}</span>
                </div>
                <div className="border-t border-slate-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Date</span>
                  <span className="text-slate-900 font-medium">
                    {incident.occurredAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="border-t border-slate-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">News Sources</span>
                  <span className="text-slate-900 font-medium">
                    {incident.sources.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Searches */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
                Related Searches
              </h3>
              <div className="space-y-2">
                {incident.city && incident.state && (
                  <Link
                    href={`/accidents/${incident.state.toLowerCase()}/${incident.city.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-blue-800 hover:text-blue-900 text-sm hover:underline"
                  >
                    More accidents in {incident.city}
                  </Link>
                )}
                {incident.state && (
                  <Link
                    href={`/accidents/${incident.state.toLowerCase()}`}
                    className="block text-blue-800 hover:text-blue-900 text-sm hover:underline"
                  >
                    Accidents in {incident.state}
                  </Link>
                )}
                <Link
                  href="/accidents"
                  className="block text-blue-800 hover:text-blue-900 text-sm hover:underline"
                >
                  Browse all accidents
                </Link>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
                Share This Report
              </h3>
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

    {/* Floating Desktop/Tablet CTA Widget - Bottom right on md+ screens */}
    <div className="hidden md:block fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl p-5">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
        Were you involved in this crash?
      </p>
      <p className="text-sm text-slate-700 mb-3 leading-relaxed">
        Get a free consultation from a local injury lawyer about your rights and
        next steps after this accident.
      </p>
      <Link
        href="/legal-help"
        className="block w-full rounded-lg bg-blue-600 text-white text-sm font-semibold py-2.5 text-center hover:bg-blue-700 transition"
      >
        Talk to a local injury lawyer
      </Link>
      <p className="mt-2 text-[11px] leading-snug text-slate-500 text-center">
        We&apos;ll connect you with a lawyer who handles crashes like this in
        your area.
      </p>
    </div>

    {/* Fixed Mobile CTA - Bottom bar on small screens */}
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
            Injured in this crash?
          </p>
          <p className="text-xs text-slate-600">
            Tap below to speak with a local injury lawyer about your options.
          </p>
        </div>
        <Link
          href="/legal-help"
          className="shrink-0 rounded-lg bg-blue-600 text-white text-xs font-semibold px-3 py-2 hover:bg-blue-700 transition"
        >
          Get Help
        </Link>
      </div>
    </div>
    </>
  );
}
