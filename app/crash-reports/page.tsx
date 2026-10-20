import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { CRASH_REPORT_GUIDES, formatCheckedOn } from "@/lib/crashReportGuides";

export const metadata: Metadata = {
  title: "How to Get a Crash Report in Every State",
  description:
    "State-by-state guides to getting a copy of a police crash report: who keeps the reports, how to request one, and links to the official request pages.",
  alternates: { canonical: "/crash-reports" },
};

export default function CrashReportGuidesPage() {
  const guides = [...CRASH_REPORT_GUIDES].sort((a, b) => a.name.localeCompare(b.name));
  const latestCheck = guides.reduce((latest, g) => (g.checkedOn > latest ? g.checkedOn : latest), "");

  return (
    <PageContainer>
      <div className="mb-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
          Crash Report Guides by State
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Find out who keeps crash reports in your state, how to request a copy, and where the
          official request pages are. Each guide is built from official state sources, and anything
          we couldn&apos;t confirm is marked as such.
        </p>
        {latestCheck && (
          <p className="text-sm text-neutral-500 mt-4">
            Last verified against official sources on {formatCheckedOn(latestCheck)}.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/crash-reports/${guide.slug}`}
            className="bg-white rounded-xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-4 py-3 text-neutral-800 hover:border-[#2A7D6E]/40 hover:text-[#2A7D6E] transition-colors text-sm font-medium"
          >
            {guide.name}
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-3xl">
        <p className="text-amber-800 text-sm leading-relaxed">
          These guides summarize official sources. Procedures and fees can change, so check the
          agency&apos;s page before you pay. CarCrashReport.com is not a government agency or a law
          firm, and nothing here is legal advice.
        </p>
      </div>
    </PageContainer>
  );
}
