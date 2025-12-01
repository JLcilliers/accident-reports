/**
 * HeroSection - Top section of incident page with headline, meta, and primary CTA
 */

import Link from "next/link";

interface HeroSectionProps {
  headline: string;
  location: string;
  formattedDate: string;
  summary?: string | null;
}

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export function HeroSection({ headline, location, formattedDate, summary }: HeroSectionProps) {
  return (
    <header className="mb-8">
      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-4">
        <span className="inline-flex items-center gap-1.5">
          <LocationIcon />
          {location}
        </span>
        <span className="text-slate-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon />
          {formattedDate}
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-5">
        {headline}
      </h1>

      {/* Summary card */}
      {summary && (
        <div className="bg-[var(--primary-light)] border border-[var(--primary)]/20 rounded-xl p-4 mb-5">
          <p className="text-[15px] text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Primary CTA */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/get-report/step-1"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Request Crash Report
        </Link>
        <span className="text-sm text-slate-500">
          Get your official police report
        </span>
      </div>
    </header>
  );
}
