/**
 * ArticleContent - Styled wrapper for ReactMarkdown article content
 * Features:
 * - Maps long headings to short, scannable labels
 * - Removes duplicate title from body
 * - Adds visual section breaks with icons
 * - Collapsible tail for long content
 */

"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface ArticleContentProps {
  content: string;
  className?: string;
  /** Show "Read more" collapse after this many characters (0 = no collapse) */
  collapseAfter?: number;
}

// Heading mappings: long verbose headings → short scannable labels
const HEADING_MAP: Record<string, { label: string; icon: string }> = {
  // Core incident sections
  "what we know about the crash": { label: "Crash Overview", icon: "📝" },
  "people involved and injuries": { label: "People Involved", icon: "👥" },
  "investigation and possible contributing factors": { label: "Investigation Status", icon: "🔍" },
  "traffic impact": { label: "Traffic Impact", icon: "🚗" },
  "what to do if you were involved in this crash": { label: "If You Were Involved", icon: "ℹ️" },
  "how to get the official crash report": { label: "Getting the Report", icon: "📄" },
  "legal disclaimer and sources": { label: "Disclaimer & Sources", icon: "⚖️" },
  // Fallback patterns
  "key facts": { label: "Key Facts", icon: "📋" },
  "emergency response": { label: "Emergency Response", icon: "🚑" },
  "victim": { label: "Victim Information", icon: "👤" },
  "location": { label: "Location Details", icon: "📍" },
};

/**
 * Transform a heading to a shorter, scannable version
 */
function transformHeading(text: string): { label: string; icon: string } | null {
  const lower = text.toLowerCase().trim();

  // Direct match
  if (HEADING_MAP[lower]) {
    return HEADING_MAP[lower];
  }

  // Partial match (for headings that include location names etc.)
  for (const [pattern, result] of Object.entries(HEADING_MAP)) {
    if (lower.includes(pattern)) {
      return result;
    }
  }

  return null;
}

/**
 * Check if this looks like a repeated title (long, location-specific H1/H2)
 */
function isRepeatedTitle(text: string, level: number): boolean {
  if (level > 2) return false;

  const lower = text.toLowerCase();
  // Skip if it looks like a full headline with location
  const hasLocation = /\b(ca|tx|fl|ny|nj|pa|oh|il|ga|nc|mi|az|wa|co|va|ma|tn|in|mo|md|wi|mn|sc|al|la|ky|or|ok|ct|ia|ut|nv|ar|ms|ks|nm|ne|wv|id|hi|nh|me|mt|ri|de|sd|nd|ak|dc|wy|vt)\b/i.test(text);
  const hasRoadOrIntersection = /\b(road|rd|street|st|avenue|ave|highway|hwy|interstate|i-\d|route|intersection|&)\b/i.test(lower);
  const isLong = text.length > 50;

  return level === 1 || (isLong && hasLocation && hasRoadOrIntersection);
}

/**
 * Custom components for ReactMarkdown with heading transformation
 */
function createMarkdownComponents(hideTitle: boolean): Components {
  return {
    // Transform H1 - usually the repeated title, hide it
    h1: ({ children }) => {
      const text = String(children);
      if (hideTitle && isRepeatedTitle(text, 1)) {
        return null; // Hide repeated title
      }
      return (
        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-3">
          {children}
        </h2>
      );
    },

    // Transform H2 - main section headings
    h2: ({ children }) => {
      const text = String(children);

      // Hide if it's a repeated title-like heading
      if (hideTitle && isRepeatedTitle(text, 2)) {
        return null;
      }

      const transformed = transformHeading(text);

      if (transformed) {
        return (
          <div className="flex items-center gap-2.5 mt-8 mb-4 pt-6 border-t border-slate-100 first:border-t-0 first:pt-0 first:mt-0">
            <span className="text-lg" role="img" aria-hidden="true">
              {transformed.icon}
            </span>
            <h3 className="text-base font-semibold text-slate-900">
              {transformed.label}
            </h3>
          </div>
        );
      }

      // Default styling for unmapped headings
      return (
        <h3 className="text-base font-semibold text-slate-900 mt-8 mb-3 pt-6 border-t border-slate-100 first:border-t-0 first:pt-0 first:mt-0">
          {children}
        </h3>
      );
    },

    // H3 becomes smaller subsection
    h3: ({ children }) => (
      <h4 className="text-sm font-semibold text-slate-800 mt-5 mb-2">
        {children}
      </h4>
    ),

    // Paragraphs with better spacing
    p: ({ children }) => (
      <p className="text-[15px] leading-[1.7] text-slate-700 mb-4">
        {children}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc pl-5 space-y-2 mb-4 text-[15px] text-slate-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 space-y-2 mb-4 text-[15px] text-slate-700">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),

    // Blockquotes (disclaimers, notes)
    blockquote: ({ children }) => (
      <blockquote className="border-l-3 border-[var(--primary)] bg-slate-50 py-3 px-4 rounded-r-lg my-4 text-sm text-slate-600 italic">
        {children}
      </blockquote>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--primary)] font-medium hover:underline"
      >
        {children}
      </a>
    ),

    // Strong/bold - for key phrases only
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
  };
}

/**
 * Split content into "above fold" and "below fold" parts
 */
function splitContent(content: string, collapseAfter: number): { above: string; below: string } {
  if (collapseAfter <= 0 || content.length <= collapseAfter) {
    return { above: content, below: "" };
  }

  // Find a good split point (after a paragraph or heading)
  const lines = content.split("\n");
  let charCount = 0;
  let splitIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    charCount += lines[i].length + 1;

    // Look for a good break point after reaching threshold
    if (charCount >= collapseAfter) {
      // Try to break after a blank line (paragraph end) or before a heading
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].trim() === "" || lines[j].startsWith("##")) {
          splitIndex = j;
          break;
        }
      }
      if (splitIndex === 0) splitIndex = i;
      break;
    }
  }

  if (splitIndex === 0 || splitIndex >= lines.length - 3) {
    return { above: content, below: "" };
  }

  return {
    above: lines.slice(0, splitIndex).join("\n"),
    below: lines.slice(splitIndex).join("\n"),
  };
}

export function ArticleContent({
  content,
  className = "",
  collapseAfter = 2000, // Default: collapse after ~2000 chars
}: ArticleContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { above, below } = useMemo(
    () => splitContent(content, collapseAfter),
    [content, collapseAfter]
  );

  const hasMore = below.length > 0;
  const components = useMemo(() => createMarkdownComponents(true), []);

  return (
    <article className={`article-content ${className}`}>
      {/* Above-fold content (always visible) */}
      <div className="article-section">
        <ReactMarkdown components={components}>{above}</ReactMarkdown>
      </div>

      {/* Below-fold content (collapsible) */}
      {hasMore && (
        <>
          {isExpanded && (
            <div className="article-section">
              <ReactMarkdown components={components}>{below}</ReactMarkdown>
            </div>
          )}

          {/* Expand/collapse button */}
          <div className={`relative ${!isExpanded ? "mt-0" : "mt-6"}`}>
            {/* Fade overlay when collapsed */}
            {!isExpanded && (
              <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors py-2"
            >
              {isExpanded ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                  Show less
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  Read full incident details
                </>
              )}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
