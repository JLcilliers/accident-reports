import { XMLParser } from "fast-xml-parser";
import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";
import robotsParser from "robots-parser";

// Publishers see who is asking, and their robots.txt rules for this name (or for every crawler) are followed.
const USER_AGENT = "CarCrashReportBot/1.0 (+https://www.carcrashreport.com)";
export const BOT_NAME = "CarCrashReportBot";

const LOOKUP_BUDGET_MS = 25_000;
const FETCH_TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 5;
const MAX_DOMAINS = 2;
const MAX_SITEMAPS = 4;
const RSS_PATHS = ["/feed/", "/rss"];
const MAX_ROBOTS_BYTES = 500_000;
const MAX_SITEMAP_BYTES = 5_000_000;
const MAX_PAGE_BYTES = 3_000_000;
// Less than this is a teaser or a paywall, not the story.
const MIN_TEXT_CHARS = 600;
const MAX_TEXT_CHARS = 12_000;

const xml = new XMLParser({ removeNSPrefix: true, htmlEntities: true });

interface Fetched {
  status: number;
  url: string;
  contentType: string;
  text: string;
}

/**
 * GET with this site's User-Agent, following redirects only to addresses `mayFetch` accepts, and giving up
 * after FETCH_TIMEOUT_MS or once the body passes maxBytes (null).
 */
export async function get(
  url: string,
  budget: AbortSignal,
  maxBytes: number,
  mayFetch: (url: string) => boolean = () => true
): Promise<Fetched | null> {
  let res: Response | null = null;
  for (let hop = 0; hop <= MAX_REDIRECTS && !res; hop++) {
    if (!mayFetch(url)) return null;
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.any([budget, AbortSignal.timeout(FETCH_TIMEOUT_MS)]),
    });
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      url = new URL(location, url).href;
    } else {
      res = response;
    }
  }
  if (!res) return null;
  const fetched = { status: res.status, url, contentType: res.headers.get("content-type") ?? "" };
  if (!res.ok || !res.body || Number(res.headers.get("content-length")) > maxBytes) {
    await res.body?.cancel();
    return res.ok ? null : { ...fetched, text: "" };
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return { ...fetched, text: new TextDecoder().decode(Buffer.concat(chunks)) };
}

const normalize = (text: string) =>
  text.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

const asArray = <T>(value: T | T[] | undefined): T[] => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

/** The path and query of a URL, so a host name like abc7news.com does not count as "news". */
const pathOf = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return "";
  }
};
const NEWS_SITEMAP = /news|feed\/gn|fastchanging/i;
const MEDIA_SITEMAP = /video|image/i;

/** The page in a sitemap or RSS feed whose title or URL slug carries the story's headline. */
function findInSitemap(urls: unknown[], headline: string): string | null {
  const key = normalize(headline).split(" ").slice(0, 8).join(" ");
  if (key.split(" ").length < 4) return null;
  for (const entry of urls as { loc?: unknown; news?: { title?: unknown } }[]) {
    const loc = typeof entry?.loc === "string" ? entry.loc.trim() : "";
    if (!loc) continue;
    const slug = pathOf(loc).split("/").filter(Boolean).pop() ?? "";
    const title = entry.news?.title != null ? String(entry.news.title) : "";
    if ([title, slug].some((text) => normalize(text.replace(/-/g, " ")).includes(key))) return loc;
  }
  return null;
}

/** Finds and reads one story on one publisher's site, following its robots.txt at every step. */
async function lookUp(domain: string, headline: string, budget: AbortSignal): Promise<{ text: string } | { miss: string }> {
  const robotsRes = await get(`https://${domain}/robots.txt`, budget, MAX_ROBOTS_BYTES);
  if (!robotsRes) return { miss: "robots.txt too large or redirected too often" };
  // RFC 9309: a missing robots.txt (4xx) allows everything, an unreachable one (5xx) allows nothing.
  if (robotsRes.status >= 500) return { miss: `robots.txt returned ${robotsRes.status}` };
  const robots = robotsParser(robotsRes.url, robotsRes.status === 200 ? robotsRes.text : "");
  const allowed = (url: string) => robots.isAllowed(url, BOT_NAME) === true;

  const declared = robots.getSitemaps().filter((url) => !/\.gz$/i.test(url) && !MEDIA_SITEMAP.test(pathOf(url)));
  const news = declared.filter((url) => NEWS_SITEMAP.test(pathOf(url)));
  // News sitemaps first; the others still have the story once it has aged out of a 48-hour news sitemap.
  const queue = [...news, ...declared.filter((url) => !news.includes(url))];
  let checked = 0;
  let page: string | null = null;
  while (queue.length && checked < MAX_SITEMAPS && !page) {
    const sitemapUrl = queue.shift()!;
    if (!allowed(sitemapUrl)) continue;
    checked++;
    const sitemap = await get(sitemapUrl, budget, MAX_SITEMAP_BYTES, allowed);
    if (!sitemap?.text) continue;
    const parsed = xml.parse(sitemap.text);
    if (parsed?.sitemapindex) {
      const children = asArray(parsed.sitemapindex.sitemap as { loc?: unknown } | { loc?: unknown }[])
        .map((child) => (typeof child?.loc === "string" ? child.loc.trim() : ""))
        .filter((url) => url && !/\.gz$/i.test(url) && !MEDIA_SITEMAP.test(pathOf(url)));
      // Without a news child, the newest is the first (dated indexes) or the last (numbered ones).
      const news = children.find((url) => NEWS_SITEMAP.test(pathOf(url)));
      queue.unshift(...new Set(news ? [news] : [children[0], children[children.length - 1]].filter(Boolean)));
      continue;
    }
    page = findInSitemap(asArray(parsed?.urlset?.url), headline);
  }
  // Publishers without a news sitemap, or whose sitemap lags, often list the story in their RSS feed.
  for (const feedUrl of RSS_PATHS.map((path) => new URL(path, robotsRes.url).href)) {
    if (page) break;
    if (!allowed(feedUrl)) continue;
    const feed = await get(feedUrl, budget, MAX_SITEMAP_BYTES, allowed);
    if (!feed?.text) continue;
    const items = asArray(xml.parse(feed.text)?.rss?.channel?.item as { title?: unknown; link?: unknown }[] | undefined);
    page = findInSitemap(items.map((item) => ({ loc: item?.link, news: { title: item?.title } })), headline);
  }
  if (!page) return { miss: `not in ${checked} sitemap(s) or the RSS feed` };
  if (!allowed(page)) return { miss: "robots.txt disallows the article" };

  const html = await get(page, budget, MAX_PAGE_BYTES, allowed);
  if (!html) return { miss: "article too large or redirected where robots.txt disallows" };
  if (!html.text || !/html/i.test(html.contentType)) return { miss: `article returned ${html.status} ${html.contentType}` };
  const dom = new JSDOM(html.text, { url: html.url, virtualConsole: new VirtualConsole() });
  try {
    const text = (new Readability(dom.window.document).parse()?.textContent ?? "").replace(/\s+/g, " ").trim();
    if (text.length < MIN_TEXT_CHARS) return { miss: `only ${text.length} characters of text` };
    return { text: text.slice(0, MAX_TEXT_CHARS) };
  } finally {
    dom.window.close();
  }
}

/**
 * Looks for the full text of an incident's story on its publishers' own sites: the publisher's robots.txt
 * names its sitemaps, the news sitemap gives the story's address, and the page is read only if robots.txt
 * allows it. Stops at the first publisher that works, within LOOKUP_BUDGET_MS. Returns null when none does.
 *
 * The text is for the model to write from and for the copy check only: never store, log or show it.
 */
export async function fetchPublisherText(
  sources: { title: string; publisherDomain?: string | null }[]
): Promise<string | null> {
  const budget = AbortSignal.timeout(LOOKUP_BUDGET_MS);
  const seen = new Set<string>();
  for (const source of sources) {
    const domain = source.publisherDomain?.trim().toLowerCase();
    if (!domain || seen.has(domain)) continue;
    if (seen.size >= MAX_DOMAINS || budget.aborted) break;
    seen.add(domain);
    try {
      const result = await lookUp(domain, source.title, budget);
      if ("text" in result) {
        console.log(`[publisher-text] ${domain}: ${result.text.length} characters`);
        return result.text;
      }
      console.log(`[publisher-text] ${domain}: ${result.miss}`);
    } catch (error) {
      console.log(`[publisher-text] ${domain}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return null;
}
