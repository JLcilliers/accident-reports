/**
 * NewsSourceCard - Card display for news sources
 * Shows source name, headline, and link in a scannable card format
 */

import Link from "next/link";

interface NewsSource {
  id: string;
  sourceName: string | null;
  title: string;
  url: string;
  publishedAt: Date | null;
}

interface NewsSourceCardProps {
  source: NewsSource;
}

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export function NewsSourceCard({ source }: NewsSourceCardProps) {
  const formattedDate = source.publishedAt
    ? new Date(source.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[var(--primary)]/30 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Source name and date */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide">
              {source.sourceName || "News Source"}
            </span>
            {formattedDate && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{formattedDate}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h3 className="text-sm font-medium text-slate-900 leading-snug line-clamp-2 mb-2">
            {source.title}
          </h3>

          {/* Link */}
          <Link
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            View article
            <ExternalLinkIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

interface NewsSourcesGridProps {
  sources: NewsSource[];
}

export function NewsSourcesGrid({ sources }: NewsSourcesGridProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="bg-slate-100/80 rounded-2xl border border-slate-200 p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
        News Coverage ({sources.length} {sources.length === 1 ? "Source" : "Sources"})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((source) => (
          <NewsSourceCard key={source.id} source={source} />
        ))}
      </div>
    </section>
  );
}
