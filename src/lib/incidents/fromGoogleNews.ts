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
 * US phone numbers mark law-firm adverts rather than news reports.
 */
const PHONE_NUMBER = /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/;

/**
 * Publisher names or domains of law firms, lawyers' blogs and legal-referral sites, whose crash posts are
 * adverts built on other outlets' reporting. Police news, prosecutors and attorneys general are kept.
 */
const LAW_FIRM_PUBLISHER = /lawyer|attorney|injury|legal|lawfirm|lawfuel|florida-justice\.com|\blaw\b|&\s*associates|\b(p\.?c|a\.?p\.?c|pllc|llp)\.?$/i;
const NOT_A_LAW_FIRM = /law ?enforcement|district attorney|attorney general|law ?(&|and) ?crime/i;

function isLawFirmPublisher(item: GoogleNewsItem): boolean {
  return [item.source, item.sourceDomain].some(
    (name) => !!name && LAW_FIRM_PUBLISHER.test(name.trim()) && !NOT_A_LAW_FIRM.test(name)
  );
}

/**
 * US state abbreviations and their full names for location extraction.
 */
export const US_STATES: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  "district of columbia": "DC",
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
  // Before "virginia", which it contains.
  "west virginia": "WV",
  virginia: "VA",
  washington: "WA",
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
 * "Washington, D.C.", "Washington DC" or "D.C." mean the District, not Washington state.
 */
const WASHINGTON_DC = /\bwashington,?\s+d\.?\s?c\b|\bd\.\s?c\./i;

/**
 * Checks if a text contains any accident-related phrases.
 */
function isLikelyAccident(title: string, description?: string): boolean {
  const text = (title + " " + (description ?? "")).toLowerCase();

  // First check if it should be excluded
  if (PHONE_NUMBER.test(text)) {
    return false;
  }
  for (const exclude of EXCLUDE_PHRASES) {
    if (text.includes(exclude)) {
      return false;
    }
  }

  // Then check if it's an accident
  return ACCIDENT_PHRASES.some((phrase) => text.includes(phrase));
}

/**
 * Set of valid US state abbreviations for quick lookup.
 */
const US_STATE_ABBREVIATIONS = new Set(Object.values(US_STATES));
const AMBIGUOUS_STATE_ABBREVIATIONS = new Set(["ID", "IN", "OR", "ME", "OK", "HI", "LA"]);

/**
 * Checks if extracted location data indicates a US-based incident.
 * Only returns true if we have explicit US location evidence (city or state).
 */
function isUSLocation(location: { city?: string; state?: string }): boolean {
  // Must have at least a state to be considered US
  if (location.state && US_STATE_ABBREVIATIONS.has(location.state)) {
    return true;
  }
  return false;
}

/**
 * A place name as a whole word, so "Darlington" is not Arlington and "Lamesa" is not Mesa.
 */
function namePattern(name: string): RegExp {
  return new RegExp(`\\b${name.replace(/\./g, "\\.")}\\b`, "gi");
}

const CITY_PATTERNS = Object.entries(MAJOR_CITIES).map(([city, state]) => [namePattern(city), city, state] as const);
const STATE_PATTERNS = Object.entries(US_STATES).map(([name, abbrev]) => [namePattern(name), abbrev] as const);

/**
 * Words that make a place's name part of a street or neighbourhood name ("Washington Heights", "Idaho Avenue"),
 * and for a state's name, a county's name ("Delaware County"), which can be in any state.
 */
const STREET_WORDS = ["heights", "district", "street", "st", "avenue", "ave", "road", "rd", "boulevard", "blvd", "park", "bridge", "square"];
const NOT_AFTER_CITY = new Set(STREET_WORDS);
const NOT_AFTER_STATE = new Set([...STREET_WORDS, "county", "co"]);

/**
 * Where a place's name stands for the place: not before a capitalised word in `notAfter`. A lower-case word
 * doesn't count against it ("crash on Kansas road", "a rural Iowa county").
 */
function placeMatches(text: string, pattern: RegExp, notAfter: Set<string>): RegExpExecArray[] {
  return [...text.matchAll(pattern)].filter((match) => {
    const next = text.slice(match.index + match[0].length).match(/^\s+([A-Z][A-Za-z]*)/)?.[1];
    return !next || !notAfter.has(next.toLowerCase());
  });
}

/**
 * A state code counts, except that one that is also a word ("ID released", an all-caps "CRASH IN", "South LA",
 * "ID'd", "OK's") counts only after a comma and not before an apostrophe.
 */
function isStateCode(code: string, comma?: string, apostrophe?: string): boolean {
  return US_STATE_ABBREVIATIONS.has(code) && (!AMBIGUOUS_STATE_ABBREVIATIONS.has(code) || (!!comma && !apostrophe));
}

const STATE_NAME_NEXT = new RegExp(`^,?\\s+(${Object.keys(US_STATES).join("|")})\\b`, "i");
const STATE_CODE_NEXT = /^(,)\s*([A-Z]{2})\b(['’])?/;

/**
 * The state written right after a city's name: "Arlington, Virginia", "Aurora Illinois" or "Arlington, VA". A
 * code counts only after a comma, so "Miami DE Rueben Bain" (a defensive end) is not Delaware.
 */
function stateAfter(rest: string): string | undefined {
  const name = rest.match(STATE_NAME_NEXT)?.[1];
  if (name) return US_STATES[name.toLowerCase().replace(/\s+/g, " ")];
  const [, comma, code, apostrophe] = rest.match(STATE_CODE_NEXT) ?? [];
  return code && isStateCode(code, comma, apostrophe) ? code : undefined;
}

/**
 * The text a story's place is read from: its headline and description, without the link and the publisher's
 * name that end a Google News description, so "ABC7 Chicago" or the Washington Times does not place a story.
 */
function storyText(item: GoogleNewsItem): string {
  const description = (item.description ?? "").replace(/<font[^>]*>[\s\S]*?<\/font>/gi, " ").replace(/<[^>]+>|&nbsp;/g, " ");
  return item.title + " " + description;
}

/**
 * Extracts city and state from text using known locations.
 */
function extractLocation(text: string): { city?: string; state?: string } {
  // Try to find a major city first
  for (const [pattern, city, state] of CITY_PATTERNS) {
    const matches = placeMatches(text, pattern, NOT_AFTER_CITY);
    if (matches.length > 0) {
      // Capitalize city name properly
      const capitalizedCity = city
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      // A state written after the city wins: "Arlington, Virginia" is not Arlington, Texas.
      const written = matches.map((match) => stateAfter(text.slice(match.index + match[0].length))).find(Boolean);
      return { city: capitalizedCity, state: written ?? state };
    }
  }

  if (WASHINGTON_DC.test(text)) {
    return { city: "Washington", state: "DC" };
  }

  // Try to find a state name
  for (const [pattern, abbrev] of STATE_PATTERNS) {
    if (placeMatches(text, pattern, NOT_AFTER_STATE).length > 0) {
      return { state: abbrev };
    }
  }

  // Try to find a state abbreviation (e.g., "in TX" or "Boise, ID").
  for (const [, comma, match, apostrophe] of text.matchAll(/(,\s*)?\b([A-Z]{2})\b(['’])?/g)) {
    if (isStateCode(match, comma, apostrophe)) {
      return { state: match };
    }
  }

  return {};
}

/**
 * National outlets, whose names say nothing about where a story happened ("New York Post", "Yahoo News Canada").
 */
const NATIONAL_OUTLET =
  /^(the )?(new york post|usa today|associated press( news)?|ap( news)?|reuters|fox news|cnn|nbc news|abc news|cbs news|yahoo\b.*|msn(\.com)?|daily mail( online)?|mail online|independent|newsweek)$/i;

/**
 * The state a publisher's name points to ("ABC7 Chicago", "Click2Houston", "NJ.com"), for a story that names no
 * place itself. A state written after a comma ("Portland, ME Patch") counts first. Brands run names together, so
 * names count inside words here. "Washington" does not count: the Washington Post, Times and Examiner are in the
 * District, not Washington state. National outlets give no state.
 */
function publisherState(name: string): string | undefined {
  if (NATIONAL_OUTLET.test(name.trim())) return undefined;
  const written = name.match(/,\s*([A-Z]{2})\b/)?.[1];
  if (written && US_STATE_ABBREVIATIONS.has(written)) return written;
  const brand = name.replace(/washington/gi, " ");
  const lower = brand.toLowerCase();
  for (const [place, state] of [...Object.entries(MAJOR_CITIES), ...Object.entries(US_STATES)]) {
    if (lower.includes(place)) return state;
  }
  return extractLocation(brand).state;
}

/**
 * Converts Google News items to incident candidates.
 * Filters for likely accidents, extracts location data, and ensures US-only items.
 *
 * @param items - Raw Google News items
 * @param homeState - The publisher's home state, for an item that names no place (one publisher's own feed)
 * @returns Filtered and normalized incident candidates (US-only)
 */
export function toIncidentCandidates(
  items: GoogleNewsItem[],
  homeState?: string
): IncidentCandidate[] {
  const candidates: IncidentCandidate[] = [];
  let filteredNonUS = 0;
  let filteredLawFirms = 0;

  for (const item of items) {
    if (isLawFirmPublisher(item)) {
      filteredLawFirms++;
      continue;
    }

    // First filter: must be about an accident
    if (!isLikelyAccident(item.title, item.description)) {
      continue;
    }

    const occurredAt = new Date(item.pubDate);
    // A story that names no place is placed in its publisher's state ("ABC7 Chicago" in Illinois), not its city.
    const found = extractLocation(storyText(item));
    const location = found.state ? found : { state: homeState ?? (item.source && publisherState(item.source)) };

    // Second filter: must have confirmed US location (city/state)
    if (!isUSLocation(location)) {
      filteredNonUS++;
      continue;
    }

    candidates.push({
      headline: item.title.trim(),
      link: item.link,
      publisher: item.source,
      publisherDomain: item.sourceDomain,
      occurredAt,
      snippet: item.description,
      ...location,
      country: "US",
    });
  }

  if (filteredNonUS > 0) {
    console.log(`[US Filter] Filtered out ${filteredNonUS} non-US news items`);
  }
  if (filteredLawFirms > 0) {
    console.log(`[Law firm filter] Filtered out ${filteredLawFirms} items from law-firm publishers`);
  }

  return candidates;
}
