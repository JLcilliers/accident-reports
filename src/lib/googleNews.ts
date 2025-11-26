import { XMLParser } from "fast-xml-parser";

/**
 * Represents a single item from a Google News RSS feed.
 */
export interface GoogleNewsItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  source?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

/**
 * Fetches and parses a Google News RSS feed.
 *
 * @param url - The Google News RSS URL to fetch
 * @returns An array of parsed news items
 * @throws Error if the feed cannot be fetched or parsed
 */
export async function fetchGoogleNewsFeed(
  url: string
): Promise<GoogleNewsItem[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AccidentReportsBot/1.0; +https://accidentreports.com)",
    },
    next: { revalidate: 0 }, // Don't cache on the server
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Google News RSS: ${res.status}`);
  }

  const xml = await res.text();
  const json = parser.parse(xml);

  const items = json?.rss?.channel?.item ?? [];

  // Handle case where there's only one item (not an array)
  const itemArray = Array.isArray(items) ? items : items ? [items] : [];

  return itemArray.map((item: Record<string, unknown>) => {
    // Google News puts "Title - Source" in title; we can split it.
    let title = (item.title as string) || "";
    let source: string | undefined;
    const parts = title.split(" - ");
    if (parts.length > 1) {
      source = parts[parts.length - 1];
      title = parts.slice(0, -1).join(" - ");
    }

    return {
      title,
      link: (item.link as string) || "",
      pubDate: (item.pubDate as string) || "",
      description: item.description as string | undefined,
      source,
    };
  });
}

/**
 * Fetches multiple Google News feeds in parallel with error handling.
 *
 * @param urls - Array of Google News RSS URLs to fetch
 * @returns An array of all successfully fetched news items (flattened)
 */
export async function fetchMultipleFeeds(
  urls: string[]
): Promise<{ items: GoogleNewsItem[]; errors: string[] }> {
  const results = await Promise.allSettled(urls.map(fetchGoogleNewsFeed));

  const items: GoogleNewsItem[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      errors.push(`Feed ${index}: ${result.reason?.message ?? String(result.reason)}`);
    }
  });

  return { items, errors };
}
