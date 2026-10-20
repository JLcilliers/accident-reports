import { XMLParser } from "fast-xml-parser";
import robotsParser from "robots-parser";
import { BOT_NAME, get } from "@/lib/seo/fetchPublisherText";
import type { PublisherFeed } from "../config/publisherFeeds";
import type { GoogleNewsItem } from "./googleNews";

const MAX_ROBOTS_BYTES = 500_000;
const MAX_FEED_BYTES = 5_000_000;
// The feeds are read every 30 minutes, so a day covers any missed runs without bringing in old stories.
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const xml = new XMLParser({ removeNSPrefix: true, htmlEntities: true });

const asArray = <T>(value: T | T[] | undefined): T[] => (value === undefined ? [] : Array.isArray(value) ? value : [value]);
const textOf = (value: unknown) => (typeof value === "string" || typeof value === "number" ? String(value).trim() : "");

/**
 * Reads one publisher's Google News sitemap or RSS feed, if its robots.txt allows CarCrashReportBot to, and
 * returns the stories published in the last 24 hours in the shape Google News items have, credited to the
 * publisher. Only titles, links and dates are read; the stories themselves are not fetched here.
 * Throws when robots.txt disallows the feed or the feed cannot be read.
 */
export async function fetchPublisherFeed(feed: PublisherFeed, budget: AbortSignal): Promise<GoogleNewsItem[]> {
  const robotsRes = await get(`${new URL(feed.url).origin}/robots.txt`, budget, MAX_ROBOTS_BYTES);
  if (!robotsRes) throw new Error("robots.txt too large or redirected too often");
  // RFC 9309: a missing robots.txt (4xx) allows everything, an unreachable one (5xx) allows nothing.
  if (robotsRes.status >= 500) throw new Error(`robots.txt returned ${robotsRes.status}`);
  const robots = robotsParser(robotsRes.url, robotsRes.status === 200 ? robotsRes.text : "");
  const allowed = (url: string) => robots.isAllowed(url, BOT_NAME) === true;
  if (!allowed(feed.url)) throw new Error("robots.txt disallows the feed");

  const res = await get(feed.url, budget, MAX_FEED_BYTES, allowed);
  if (!res) throw new Error("feed too large or redirected where robots.txt disallows");
  if (!res.text) throw new Error(`feed returned ${res.status}`);
  const parsed = xml.parse(res.text);

  const entries = [
    ...asArray(parsed?.urlset?.url as { loc?: unknown; news?: { title?: unknown; publication_date?: unknown } }[] | undefined).map(
      (entry) => ({ title: textOf(entry?.news?.title), link: textOf(entry?.loc), date: textOf(entry?.news?.publication_date) })
    ),
    ...asArray(parsed?.rss?.channel?.item as Record<string, unknown>[] | undefined).map((item) => ({
      title: textOf(item?.title),
      link: textOf(item?.link),
      date: textOf(item?.pubDate),
    })),
  ];
  const since = Date.now() - MAX_AGE_MS;
  return entries
    .filter((entry) => entry.title && entry.link && new Date(entry.date).getTime() >= since)
    .map((entry) => ({ title: entry.title, link: entry.link, pubDate: entry.date, source: feed.name, sourceDomain: feed.host }));
}
