import type { GoogleNewsItem } from "../googleNews";
import type { IncidentCandidate } from "./types";

/**
 * Phrases that indicate an article is about an accident.
 * Used for filtering relevant stories from news feeds.
 */
const ACCIDENT_PHRASES = [
  "car accident",
  "car crash",
  "traffic accident",
  "traffic collision",
  "multi-vehicle",
  "crash closes",
  "hit-and-run",
  "hit and run",
  "pedestrian struck",
  "pedestrian hit",
  "fatal crash",
  "fatal accident",
  "deadly crash",
  "deadly accident",
  "wrong-way",
  "rollover crash",
  "rollover accident",
  "vehicle collision",
  "motorcycle crash",
  "motorcycle accident",
  "truck crash",
  "truck accident",
  "highway crash",
  "freeway crash",
  "interstate crash",
  "killed in crash",
  "died in crash",
  "injured in crash",
  "accident victim",
  "crash victim",
  "collision victim",
];

/**
 * Phrases that indicate the article is NOT about a relevant accident.
 * Used to filter out false positives.
 */
const EXCLUDE_PHRASES = [
  "stock crash",
  "market crash",
  "plane crash",
  "airplane crash",
  "helicopter crash",
  "train crash",
  "boat accident",
  "boating accident",
  "video game",
  "movie review",
  "tv show",
];

/**
 * US state abbreviations and their full names for location extraction.
 */
const US_STATES: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

/**
 * Major US cities and their states for location extraction.
 */
const MAJOR_CITIES: Record<string, string> = {
  // Colorado
  denver: "CO",
  "colorado springs": "CO",
  aurora: "CO",
  boulder: "CO",
  "fort collins": "CO",

  // Texas
  houston: "TX",
  dallas: "TX",
  austin: "TX",
  "san antonio": "TX",
  "fort worth": "TX",
  "el paso": "TX",
  arlington: "TX",
  plano: "TX",

  // Arizona
  phoenix: "AZ",
  tucson: "AZ",
  mesa: "AZ",
  scottsdale: "AZ",
  chandler: "AZ",
  tempe: "AZ",

  // Florida
  miami: "FL",
  orlando: "FL",
  tampa: "FL",
  jacksonville: "FL",
  "fort lauderdale": "FL",
  "st. petersburg": "FL",
  "st petersburg": "FL",

  // California
  "los angeles": "CA",
  "san francisco": "CA",
  "san diego": "CA",
  "san jose": "CA",
  sacramento: "CA",
  fresno: "CA",
  oakland: "CA",
  "long beach": "CA",

  // Other major cities
  "new york": "NY",
  chicago: "IL",
  philadelphia: "PA",
  seattle: "WA",
  boston: "MA",
  atlanta: "GA",
  detroit: "MI",
  minneapolis: "MN",
  "las vegas": "NV",
  portland: "OR",
  charlotte: "NC",
  baltimore: "MD",
  pittsburgh: "PA",
  cleveland: "OH",
  "kansas city": "MO",
  indianapolis: "IN",
  columbus: "OH",
  nashville: "TN",
  memphis: "TN",
  "new orleans": "LA",
  milwaukee: "WI",
  "salt lake city": "UT",
  raleigh: "NC",
  richmond: "VA",
  hartford: "CT",
  providence: "RI",
};

/**
 * Checks if a text contains any accident-related phrases.
 */
function isLikelyAccident(title: string, description?: string): boolean {
  const text = (title + " " + (description ?? "")).toLowerCase();

  // First check if it should be excluded
  for (const exclude of EXCLUDE_PHRASES) {
    if (text.includes(exclude)) {
      return false;
    }
  }

  // Then check if it's an accident
  return ACCIDENT_PHRASES.some((phrase) => text.includes(phrase));
}

/**
 * Extracts city and state from text using known locations.
 */
function extractLocation(text: string): { city?: string; state?: string } {
  const lower = text.toLowerCase();

  // Try to find a major city first
  for (const [city, state] of Object.entries(MAJOR_CITIES)) {
    if (lower.includes(city)) {
      // Capitalize city name properly
      const capitalizedCity = city
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { city: capitalizedCity, state };
    }
  }

  // Try to find a state name
  for (const [stateName, abbrev] of Object.entries(US_STATES)) {
    if (lower.includes(stateName)) {
      return { state: abbrev };
    }
  }

  // Try to find a state abbreviation (e.g., "in TX" or "Texas")
  const stateAbbrevPattern = /\b([A-Z]{2})\b/g;
  const matches = text.match(stateAbbrevPattern);
  if (matches) {
    const stateAbbrevs = Object.values(US_STATES);
    for (const match of matches) {
      if (stateAbbrevs.includes(match)) {
        return { state: match };
      }
    }
  }

  return {};
}

/**
 * Converts Google News items to incident candidates.
 * Filters for likely accidents and extracts location data.
 *
 * @param items - Raw Google News items
 * @returns Filtered and normalized incident candidates
 */
export function toIncidentCandidates(
  items: GoogleNewsItem[]
): IncidentCandidate[] {
  return items
    .filter((item) => isLikelyAccident(item.title, item.description))
    .map((item) => {
      const occurredAt = new Date(item.pubDate);
      const fullText = item.title + " " + (item.description ?? "");
      const location = extractLocation(fullText);

      return {
        headline: item.title.trim(),
        link: item.link,
        publisher: item.source,
        occurredAt,
        snippet: item.description,
        ...location,
        country: "US",
      };
    });
}
