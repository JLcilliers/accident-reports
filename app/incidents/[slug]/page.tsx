import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { stripHtmlAndPublisher } from "@/lib/text";
import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";
import { parseArticleMeta, buildKeywordsString } from "@/lib/seo/parseArticleMeta";
import {
  buildLocationInfo,
  logLocationResolution,
} from "@/lib/location";
import {
  HeroSection,
  KeyFactsCard,
  ActionStepsGrid,
  NewsSourcesGrid,
  ArticleContent,
  SidebarCTA,
  MobileBottomCTA,
} from "@/components/incident";

export const revalidate = 600; // Re-generate every 10 minutes

async function getIncident(slug: string) {
  return prisma.incident.findUnique({
    where: { slug },
    include: { sources: true },
  });
}

export async function generateStaticParams() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { occurredAt: "desc" },
      take: 500,
      select: { slug: true },
    });
    return incidents.map((incident) => ({ slug: incident.slug }));
  } catch {
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
    return { title: "Incident Not Found | AccidentReports" };
  }

  const extractedFacts = incident.extractedFacts as AccidentFacts | null;
  const locationInfo = buildLocationInfo({
    extractedFacts,
    dbCity: incident.city,
    dbState: incident.state,
  });

  const parsedMeta = parseArticleMeta(incident.articleBody);

  let title =
    parsedMeta.seoTitle ||
    incident.seoTitle ||
    `${incident.headline} | AccidentReports`;

  if (
    !parsedMeta.seoTitle &&
    !incident.seoTitle &&
    locationInfo.resolutionTier <= 3 &&
    !title.toLowerCase().includes(locationInfo.displayLocation.toLowerCase())
  ) {
    const titleWithLocation = `${incident.headline} – ${locationInfo.shortLocation || locationInfo.displayLocation}`;
    title = titleWithLocation.length <= 70 ? titleWithLocation : title;
  }

  title = title.slice(0, 70);

  let description = parsedMeta.metaDescription || incident.seoDescription;

  if (!description) {
    if (locationInfo.resolutionTier <= 3) {
      description = `Details about a traffic crash near ${locationInfo.displayLocation} on ${incident.occurredAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Learn what happened and how to get the official report.`;
    } else {
      description =
        incident.summary?.slice(0, 155) ||
        `Accident report from ${incident.occurredAt.toDateString()}. Find details and learn how to get the official crash report.`;
    }
  }

  description = description.slice(0, 160);
  const keywords = buildKeywordsString(parsedMeta);

  return {
    title,
    description,
    ...(keywords && { keywords }),
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

  const extractedFacts = incident.extractedFacts as AccidentFacts | null;

  const locationInfo = buildLocationInfo({
    extractedFacts,
    dbCity: incident.city,
    dbState: incident.state,
  });

  logLocationResolution(incident.slug, locationInfo);

  const location = locationInfo.displayLocation;
  const formattedDate = incident.occurredAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const cleanedHeadline = stripHtmlAndPublisher(incident.headline) ?? incident.headline;

  // JSON-LD structured data
  const seoHeadline = incident.seoTitle || incident.headline;
  const seoDescription =
    incident.seoDescription || incident.summary || `Traffic accident report for ${location}`;

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
    ...(locationInfo.resolutionTier < 5
      ? {
          contentLocation: {
            "@type": "Place",
            name: locationInfo.displayLocation,
            ...(locationInfo.city || locationInfo.state
              ? {
                  address: {
                    "@type": "PostalAddress",
                    ...(locationInfo.city && { addressLocality: locationInfo.city }),
                    ...(locationInfo.state && { addressRegion: locationInfo.state }),
                    addressCountry: "US",
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(aboutEntities.length > 0 ? { about: aboutEntities } : {}),
  };

  const qualityStatus = incident.articleQualityStatus ?? "OK";
  const qualityNotes = incident.articleQualityNotes;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hidden data for admin tooling */}
      <div
        data-article-quality={qualityStatus}
        data-article-quality-notes={qualityNotes ?? ""}
        className="hidden"
        aria-hidden="true"
      />

      <div className="min-h-screen bg-[var(--bg-page)]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-[var(--primary)] transition">
                Home
              </Link>
              <span className="text-slate-300">/</span>
              <Link href="/accidents" className="hover:text-[var(--primary)] transition">
                Accidents
              </Link>
              {incident.state && (
                <>
                  <span className="text-slate-300">/</span>
                  <Link
                    href={`/accidents/${incident.state.toLowerCase()}`}
                    className="hover:text-[var(--primary)] transition"
                  >
                    {incident.state}
                  </Link>
                </>
              )}
              {incident.city && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-700 font-medium truncate max-w-[150px]">
                    {incident.city}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Main Layout */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            {/* Main Content Column - Narrower for readability */}
            <main className="max-w-[720px]">
              {/* Hero Section */}
              <HeroSection
                headline={cleanedHeadline}
                location={location}
                formattedDate={formattedDate}
                summary={incident.summary ? stripHtmlAndPublisher(incident.summary) : null}
              />

              {/* Key Facts Card */}
              <div className="mb-6">
                <KeyFactsCard
                  facts={extractedFacts}
                  location={location}
                  formattedDate={formattedDate}
                  sourceCount={incident.sources.length}
                  city={incident.city}
                  state={incident.state}
                />
              </div>

              {/* Full Article Content */}
              {incident.articleBody && (
                <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6">
                  <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-semibold text-slate-900 mb-5">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    Full Incident Report
                  </h2>
                  <ArticleContent content={incident.articleBody} />
                </section>
              )}

              {/* News Coverage */}
              <div className="mb-6">
                <NewsSourcesGrid
                  sources={incident.sources.map((s) => ({
                    id: s.id,
                    sourceName: s.publisher,
                    title: s.title,
                    url: s.url,
                    publishedAt: s.publishedAt,
                  }))}
                />
              </div>

              {/* What To Do Section */}
              <div className="mb-6">
                <ActionStepsGrid />
              </div>

              {/* Getting Your Report CTA */}
              <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6">
                <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-semibold text-slate-900 mb-3">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Get the Official Police Report
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                  If you were involved in this accident, the official police report is essential
                  for insurance claims and legal matters. Reports are typically available within
                  5-10 business days.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/get-report/step-1"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl transition-colors"
                  >
                    Request Your Report
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <span className="text-sm text-slate-500">
                    Delivered digitally within 24-48 hours
                  </span>
                </div>
              </section>

              {/* Why Report Is Important */}
              <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Why the Official Report Matters
                </h2>
                <div className="space-y-3 text-slate-600 text-[15px] leading-relaxed">
                  <p>
                    The official accident report documents key facts—who was involved, where
                    and when it happened, the officer&apos;s fault determination, and witness
                    statements. Insurance companies rely on it to process claims.
                  </p>
                  <p>
                    Without this report, proving fault becomes significantly harder. Even if
                    you don&apos;t plan to file a lawsuit, having the official record protects
                    you if the other party&apos;s insurance disputes your account.
                  </p>
                </div>
              </section>

              {/* Disclaimer */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 mb-8">
                <p className="text-amber-800 text-sm leading-relaxed">
                  <strong>Disclaimer:</strong> This information is compiled from publicly
                  available news sources and may be incomplete or updated as investigations
                  continue. For official records, contact the law-enforcement agency that
                  handled the crash.
                </p>
                <p className="text-amber-700/80 text-xs mt-2">
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
            </main>

            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:block">
              <SidebarCTA city={incident.city} state={incident.state} />

              {/* Related Searches */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-6">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                  Related Searches
                </h3>
                <div className="space-y-2.5">
                  {incident.city && incident.state && (
                    <Link
                      href={`/accidents/${incident.state.toLowerCase()}/${incident.city.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      More in {incident.city}
                    </Link>
                  )}
                  {incident.state && (
                    <Link
                      href={`/accidents/${incident.state.toLowerCase()}`}
                      className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      Accidents in {incident.state}
                    </Link>
                  )}
                  <Link
                    href="/accidents"
                    className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    Browse all accidents
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile Bottom CTA */}
      <MobileBottomCTA />
    </>
  );
}
