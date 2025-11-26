/**
 * Text cleaning utilities for accident report content
 */

/**
 * Clean RSS snippet text from Google News feeds
 * Removes HTML tags, entities, and junk content
 */
export function cleanRssSnippet(raw?: string | null): string | null {
  if (!raw) return null;

  let text = raw;

  // Decode common HTML entities
  text = text.replace(/&nbsp;/gi, " ");
  text = text.replace(/&amp;/gi, "&");
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&lt;/gi, "<");
  text = text.replace(/&gt;/gi, ">");
  text = text.replace(/&#\d+;/g, " ");

  // Strip all HTML tags like <a>, <br>, etc.
  text = text.replace(/<[^>]+>/g, "");

  // Remove URLs that might be in the text
  text = text.replace(/https?:\/\/\S+/g, "");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // If it ends up too short or still looks like a link, skip it
  if (!text || text.length < 20 || /^https?:\/\//i.test(text)) {
    return null;
  }

  return text;
}

/**
 * Strip HTML entities, publisher names, and other junk from headline/summary text
 */
export function stripHtmlAndPublisher(raw?: string | null): string | null {
  if (!raw) return null;

  let text = raw;

  // Replace HTML entities that sneak through
  text = text.replace(/&nbsp;/gi, " ");
  text = text.replace(/&amp;/gi, "&");
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#\d+;/g, " ");

  // If there are double spaces (often where the station name is tacked on),
  // keep only the part before them.
  const doubleSpaceIndex = text.indexOf("  ");
  if (doubleSpaceIndex !== -1) {
    text = text.slice(0, doubleSpaceIndex);
  }

  // Strip any remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, "");

  // Remove brackets/braces content
  text = text.replace(/\[.*?\]/g, "");
  text = text.replace(/\{.*?\}/g, "");

  // Collapse whitespace and trim
  text = text.replace(/\s+/g, " ").trim();

  // If it ends up super short, treat as empty
  if (text.length < 25) {
    return null;
  }

  return text;
}

/**
 * Extract clean hostname from URL
 */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
