import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getGuideByCode } from "@/lib/crashReportGuides";
import { CITY_PAGES, type CityPage } from "@/lib/location/cityPages";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";

const PAGE_SIZE = 30;

const CARD = "bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]";

function cityPath(city: CityPage) {
  return `/accidents/${city.state.toLowerCase()}/${city.slug}`;
}

function pagePath(city: CityPage, page: number) {
  return page > 1 ? `${cityPath(city)}/page/${page}` : cityPath(city);
}

/** One page of a city's incidents, newest first, or null when the page is past the last one. */
export async function getCityListing(city: CityPage, page: number) {
  const where = {
    state: city.state,
    city: city.name,
    headline: { contains: city.name, mode: "insensitive" as const },
  };
  const total = await prisma.incident.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) return null;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [lastMonth, incidents] = await Promise.all([
    prisma.incident.count({ where: { ...where, occurredAt: { gte: thirtyDaysAgo } } }),
    prisma.incident.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, slug: true, headline: true, occurredAt: true, _count: { select: { sources: true } } },
    }),
  ]);

  return { total, totalPages, lastMonth, incidents };
}

type CityListing = NonNullable<Awaited<ReturnType<typeof getCityListing>>>;

export function cityMetadata(city: CityPage, page: number): Metadata {
  const stateName = getGuideByCode(city.state)?.name ?? city.state;
  return {
    title: `${city.name}, ${city.state} Traffic Accidents${page > 1 ? ` (Page ${page})` : ""}`,
    description: `Recent traffic accidents in ${city.name}, ${stateName}, from local news reports, with links to every source and how to get the official crash report.`,
    alternates: { canonical: pagePath(city, page) },
  };
}

export default function CityAccidents({
  city,
  page,
  listing,
}: {
  city: CityPage;
  page: number;
  listing: CityListing;
}) {
  const guide = getGuideByCode(city.state);
  const stateName = guide?.name ?? city.state;
  const statePath = `/accidents/${city.state.toLowerCase()}`;
  const pageUrl = `${BASE_URL}${pagePath(city, page)}`;
  const offset = (page - 1) * PAGE_SIZE;
  const otherCities = CITY_PAGES.filter((c) => c.state === city.state && c.slug !== city.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `Traffic Accidents in ${city.name}, ${stateName}`,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: "CarCrashReport.com", url: BASE_URL },
        about: { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: stateName } },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: listing.incidents.length,
          itemListElement: listing.incidents.map((incident, i) => ({
            "@type": "ListItem",
            position: offset + i + 1,
            url: `${BASE_URL}/incidents/${incident.slug}`,
            name: incident.headline,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Accidents", item: `${BASE_URL}/accidents` },
          { "@type": "ListItem", position: 3, name: stateName, item: `${BASE_URL}${statePath}` },
          { "@type": "ListItem", position: 4, name: city.name, item: `${BASE_URL}${cityPath(city)}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="min-h-screen bg-[#F7F7F7]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-12 lg:py-16">
          <div className="mb-12">
            <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-neutral-600 transition">Home</Link>
              <span>/</span>
              <Link href="/accidents" className="hover:text-neutral-600 transition">Accidents</Link>
              <span>/</span>
              <Link href={statePath} className="hover:text-neutral-600 transition">{stateName}</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">{city.name}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
              Traffic Accidents in {city.name}, {stateName}
            </h1>
            <p className="text-lg text-neutral-500 max-w-3xl mb-8 leading-relaxed">
              Crashes in {city.name} reported by local news, newest first. Each one links to its full
              report and every news source we found.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <div className={`${CARD} p-5`}>
                <p className="text-neutral-500 text-sm mb-1">Total Tracked</p>
                <p className="text-3xl font-medium text-neutral-900">{listing.total.toLocaleString()}</p>
                <p className="text-neutral-500 text-xs">Accidents</p>
              </div>
              <div className={`${CARD} p-5`}>
                <p className="text-neutral-500 text-sm mb-1">Last 30 Days</p>
                <p className="text-3xl font-medium text-neutral-900">{listing.lastMonth}</p>
                <p className="text-neutral-500 text-xs">New Reports</p>
              </div>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-medium text-neutral-900 mb-6">
                {page > 1
                  ? `Older Accidents in ${city.name}: Page ${page} of ${listing.totalPages}`
                  : `Recent Accidents in ${city.name}`}
              </h2>

              <ol className="space-y-4">
                {listing.incidents.map((incident) => (
                  <li key={incident.id} className={`${CARD} p-5`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="text-neutral-500 text-sm">
                        {incident.occurredAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {incident._count.sources > 1 && (
                        <span className="bg-neutral-100 text-neutral-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {incident._count.sources} sources
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 hover:text-[#2A7D6E] transition">
                      <Link href={`/incidents/${incident.slug}`}>{incident.headline}</Link>
                    </h3>
                  </li>
                ))}
              </ol>

              {listing.totalPages > 1 && (
                <nav className="flex items-center justify-between mt-8" aria-label="Pages">
                  {page > 1 ? (
                    <Link href={pagePath(city, page - 1)} className="text-[#2A7D6E] hover:text-[#236859] font-medium">
                      ← Newer accidents
                    </Link>
                  ) : (
                    <span />
                  )}
                  <span className="text-sm text-neutral-500">
                    Page {page} of {listing.totalPages}
                  </span>
                  {page < listing.totalPages ? (
                    <Link href={pagePath(city, page + 1)} className="text-[#2A7D6E] hover:text-[#236859] font-medium">
                      Older accidents →
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}

              <div className={`${CARD} p-6 mt-12`}>
                <h2 className="text-xl font-medium text-neutral-900 mb-4">About This List</h2>
                <div className="text-neutral-600 space-y-4">
                  <p className="leading-relaxed">
                    This page lists incidents whose news headline names {city.name}. It is not a complete
                    list of every crash in the city. Stories that mention {city.name} only in the text
                    appear on the{" "}
                    <Link href={statePath} className="text-[#2A7D6E] hover:underline">
                      {stateName} accidents page
                    </Link>
                    .
                  </p>
                  <p className="leading-relaxed">
                    Our data comes from news reports and public announcements. For official crash
                    statistics, contact the city&apos;s police department or the state&apos;s highway safety
                    office.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className={`${CARD} p-5 mb-6`}>
                <h3 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wide">
                  Across {stateName}
                </h3>
                <Link
                  href={statePath}
                  className="block w-full bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition font-medium text-center text-sm"
                >
                  All {stateName} Accidents
                </Link>
                {otherCities.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {otherCities.map((other) => (
                      <li key={other.slug}>
                        <Link href={cityPath(other)} className="text-sm text-[#2A7D6E] hover:text-[#236859]">
                          Accidents in {other.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {guide && (
                <div className={`${CARD} p-5 mb-6`}>
                  <h3 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wide">Need a Crash Report?</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    Who keeps crash reports {guide.inName} and how to request a copy.
                  </p>
                  <Link
                    href={`/crash-reports/${guide.slug}`}
                    className="block w-full bg-[#2A7D6E] text-white px-4 py-3 rounded-xl hover:bg-[#236859] transition font-medium text-center text-sm"
                  >
                    {guide.name} Crash Report Guide
                  </Link>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-amber-800 text-xs leading-relaxed">
                  <strong>Disclaimer:</strong> Information is based on publicly available data and
                  may not represent all accidents. For official statistics, contact local law
                  enforcement or the state Department of Transportation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
