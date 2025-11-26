/**
 * Google News RSS Search Queries for accident news ingestion.
 *
 * Uses Google News RSS endpoint format:
 * https://news.google.com/rss/search?q=<QUERY>&hl=en-US&gl=US&ceid=US:en
 *
 * The `when:1d` operator filters to last 24 hours.
 * Queries are designed to capture various accident types across major US metros.
 */

export const GOOGLE_NEWS_QUERIES = [
  // Major Colorado markets
  '"car accident" denver when:1d',
  '"car crash" "I-25" colorado when:1d',
  '"fatal crash" denver when:1d',
  '"traffic accident" colorado springs when:1d',
  '"multi-vehicle crash" colorado when:1d',

  // Texas markets
  '"car accident" houston when:1d',
  '"fatal crash" dallas when:1d',
  '"traffic accident" austin when:1d',
  '"car crash" san antonio when:1d',

  // Arizona markets
  '"car accident" phoenix when:1d',
  '"fatal crash" tucson when:1d',
  '"traffic collision" arizona when:1d',

  // Florida markets
  '"car accident" miami when:1d',
  '"fatal crash" orlando when:1d',
  '"traffic accident" tampa when:1d',
  '"car crash" jacksonville when:1d',

  // California markets
  '"car accident" los angeles when:1d',
  '"fatal crash" san francisco when:1d',
  '"traffic collision" san diego when:1d',
  '"car crash" sacramento when:1d',

  // Other major markets
  '"car accident" atlanta when:1d',
  '"fatal crash" chicago when:1d',
  '"traffic accident" new york when:1d',
  '"car crash" seattle when:1d',
  '"traffic collision" las vegas when:1d',

  // Generic high-impact queries
  '"multi-vehicle crash" highway when:1d',
  '"hit-and-run" fatal when:1d',
  '"pedestrian struck" when:1d',
  '"wrong-way crash" when:1d',
];

/**
 * Builds a Google News RSS URL for a given search query.
 *
 * @param query - The search query (can include operators like when:1d)
 * @returns The full Google News RSS URL
 */
export function buildGoogleNewsRssUrl(query: string): string {
  const base = "https://news.google.com/rss/search";
  const params = new URLSearchParams({
    q: query,
    hl: "en-US",
    gl: "US",
    ceid: "US:en",
  });
  return `${base}?${params.toString()}`;
}
