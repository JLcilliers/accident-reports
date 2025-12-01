/**
 * StickyReportCTA - Sticky call-to-action for requesting crash reports
 * Desktop: Sticky sidebar card
 * Mobile: Fixed bottom bar
 */

"use client";

import Link from "next/link";

interface StickyReportCTAProps {
  city?: string | null;
  state?: string | null;
}

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

/**
 * Desktop sidebar sticky CTA
 */
export function SidebarCTA({ city, state }: StickyReportCTAProps) {
  const locationText = city && state ? `${city}, ${state}` : state || "your area";

  return (
    <div className="hidden lg:block sticky top-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--primary)] px-5 py-4">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <DocumentIcon />
            </div>
            <div>
              <h3 className="font-semibold text-base">Get Your Report</h3>
              <p className="text-sm text-white/80">Official crash documentation</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-slate-600 mb-4">
            Request the official police report for accidents in {locationText}.
            Typically delivered within 24-48 hours.
          </p>

          {/* Benefits */}
          <ul className="space-y-2 mb-5">
            {[
              "Official police documentation",
              "Insurance claim support",
              "Digital delivery",
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckIcon />
                {benefit}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            href="/get-report/step-1"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl transition-colors"
          >
            Request Report
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Trust indicator */}
          <p className="text-xs text-slate-500 text-center mt-3">
            Trusted by thousands of accident victims
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile fixed bottom CTA bar
 */
export function MobileBottomCTA() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-4 py-3 safe-area-bottom">
      <Link
        href="/get-report/step-1"
        className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl transition-colors"
      >
        <DocumentIcon />
        Request Your Crash Report
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
