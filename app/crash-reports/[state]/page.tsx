import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import prisma from "@/lib/prisma";
import {
  CRASH_REPORT_GUIDES,
  SECTION_TITLES,
  formatCheckedOn,
  getGuideBySlug,
  type GuideItem,
} from "@/lib/crashReportGuides";

export const dynamicParams = false;
export const revalidate = 86400;

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";

export function generateStaticParams() {
  return CRASH_REPORT_GUIDES.map((guide) => ({ state: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const guide = getGuideBySlug(state);
  if (!guide) return {};

  const description = guide.summary
    ? guide.summary.text.slice(0, 160)
    : `Who keeps crash reports ${guide.inName}, how to request a copy, and links to the official request pages.`;

  return {
    title: `How to Get a Crash Report ${guide.inName}`,
    description,
    alternates: { canonical: `/crash-reports/${guide.slug}` },
  };
}

function SourceRefs({ refs, sources }: { refs: number[]; sources: { url: string }[] }) {
  if (!refs.length) return null;
  return (
    <sup className="ml-0.5 text-[11px] font-medium">
      {refs.map((n, i) => (
        <span key={n}>
          {i > 0 && ","}
          <a
            href={sources[n - 1].url}
            className="text-[#2A7D6E] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            title={shortUrl(sources[n - 1].url)}
            aria-label={`Source ${n}: ${shortUrl(sources[n - 1].url)}`}
          >
            {n}
          </a>
        </span>
      ))}
    </sup>
  );
}

function Item({ item, sources }: { item: GuideItem; sources: { url: string }[] }) {
  return (
    <p className="text-neutral-600 leading-relaxed">
      {item.text}
      <SourceRefs refs={item.sources} sources={sources} />
    </p>
  );
}

async function countIncidents(code: string) {
  try {
    return await prisma.incident.count({ where: { state: code } });
  } catch {
    return 0;
  }
}

function shortUrl(url: string) {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname;
    const text = `${u.hostname.replace(/^www\./, "")}${path}`;
    return text.length > 80 ? `${text.slice(0, 77)}...` : text;
  } catch {
    return url;
  }
}

export default async function CrashReportGuidePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const guide = getGuideBySlug(state);
  if (!guide) notFound();

  const checkedOn = formatCheckedOn(guide.checkedOn);
  const incidentCount = await countIncidents(guide.code);
  const sections = SECTION_TITLES.filter(({ key }) => guide.sections[key].length > 0);

  const pageUrl = `${BASE_URL}/crash-reports/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `How to Get a Crash Report ${guide.inName}`,
        description: guide.summary?.text,
        inLanguage: "en-US",
        dateModified: guide.checkedOn,
        isPartOf: { "@type": "WebSite", name: "CarCrashReport.com", url: BASE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Crash Report Guides", item: `${BASE_URL}/crash-reports` },
          { "@type": "ListItem", position: 3, name: guide.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <PageContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-neutral-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/crash-reports" className="hover:text-neutral-900 transition-colors">Crash Report Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{guide.name}</span>
      </nav>

      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
          How to Get a Crash Report {guide.inName}
        </h1>
        {guide.summary && (
          <p className="text-lg text-neutral-600 leading-relaxed">
            {guide.summary.text}
            <SourceRefs refs={guide.summary.sources} sources={guide.sources} />
          </p>
        )}
        <p className="text-sm text-neutral-500 mt-4">
          <span className="font-medium text-neutral-700">Last verified:</span> {checkedOn}, against
          the official sources linked below.
        </p>
        <p className="text-sm text-neutral-500 mt-2">
          This is general information, not legal advice. Fees and timelines can change, so check
          with the agency named here before you request a report or pay.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {sections.map(({ key, title }) => (
            <section
              key={key}
              className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <h2 className="text-xl md:text-2xl font-medium text-neutral-900 mb-4">{title}</h2>
              <div className="space-y-3">
                {guide.sections[key].map((item, i) => (
                  <Item key={i} item={item} sources={guide.sources} />
                ))}
              </div>
            </section>
          ))}

          {guide.flags.length > 0 && (
            <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-medium text-amber-900 mb-3">What we couldn&apos;t confirm</h2>
              <ul className="list-disc pl-5 space-y-2 text-amber-900/90 leading-relaxed">
                {guide.flags.map((flag, i) => (
                  <li key={i}>{flag.text}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-xl font-medium text-neutral-900 mb-4">Sources</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-600">
              {guide.sources.map((source, i) => (
                <li key={source.url} id={`source-${i + 1}`} className="break-words">
                  <a
                    href={source.url}
                    className="text-[#2A7D6E] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortUrl(source.url)}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="mt-8 lg:mt-0 space-y-6">
          {guide.links.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-sm font-medium text-neutral-900 mb-4 uppercase tracking-wide">
                Official links
              </h2>
              <ul className="space-y-3">
                {guide.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      className="text-[#2A7D6E] hover:text-[#236859] text-sm font-medium hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-sm font-medium text-neutral-900 mb-3 uppercase tracking-wide">
              Recent accidents
            </h2>
            {incidentCount > 0 ? (
              <>
                <p className="text-neutral-600 text-sm mb-4">
                  See traffic accidents reported {guide.inName}.
                </p>
                <Link
                  href={`/accidents/${guide.code.toLowerCase()}`}
                  className="block w-full bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition font-medium text-center text-sm"
                >
                  {guide.name} accidents
                </Link>
              </>
            ) : (
              <>
                <p className="text-neutral-600 text-sm mb-4">
                  We haven&apos;t covered an accident {guide.inName} yet.
                </p>
                <Link
                  href="/accidents"
                  className="block w-full bg-neutral-900 text-white px-4 py-3 rounded-xl hover:bg-neutral-800 transition font-medium text-center text-sm"
                >
                  Accidents across the US
                </Link>
              </>
            )}
          </div>

          <Link
            href="/crash-reports"
            className="block text-center text-[#2A7D6E] hover:text-[#236859] text-sm font-medium"
          >
            Guides for other states
          </Link>
        </aside>
      </div>
    </PageContainer>
  );
}
