import { PUBLISHER_FEEDS } from "../../config/publisherFeeds";
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
 * Other names for cities on the list.
 */
const CITY_ALIASES: Record<string, string> = {
  "new york city": "new york",
  nyc: "new york",
};

/**
 * AP-style state abbreviations ("Arlington, Va.").
 */
const AP_STATES: Record<string, string> = {
  "Ala.": "AL",
  "Ariz.": "AZ",
  "Ark.": "AR",
  "Calif.": "CA",
  "Colo.": "CO",
  "Conn.": "CT",
  "Del.": "DE",
  "Fla.": "FL",
  "Ga.": "GA",
  "Ill.": "IL",
  "Ind.": "IN",
  "Kan.": "KS",
  "Ky.": "KY",
  "La.": "LA",
  "Md.": "MD",
  "Mass.": "MA",
  "Mich.": "MI",
  "Minn.": "MN",
  "Miss.": "MS",
  "Mo.": "MO",
  "Mont.": "MT",
  "Neb.": "NE",
  "Nev.": "NV",
  "N.H.": "NH",
  "N.J.": "NJ",
  "N.M.": "NM",
  "N.Y.": "NY",
  "N.C.": "NC",
  "N.D.": "ND",
  "Okla.": "OK",
  "Ore.": "OR",
  "Pa.": "PA",
  "R.I.": "RI",
  "S.C.": "SC",
  "S.D.": "SD",
  "Tenn.": "TN",
  "Tex.": "TX",
  "Va.": "VA",
  "Vt.": "VT",
  "Wash.": "WA",
  "W.Va.": "WV",
  "Wis.": "WI",
  "Wyo.": "WY",
};

/**
 * The states with a county of each name that is also a state's or a listed city's name (US Census 2020, space
 * separated). "<Name> County" names the county, not the state or the city.
 */
const COUNTIES: Record<string, string> = {
  arkansas: "AR",
  arlington: "VA",
  aurora: "SD",
  austin: "TX",
  baltimore: "MD",
  boulder: "CO",
  charlotte: "FL VA",
  cleveland: "AR NC OK",
  colorado: "TX",
  columbus: "NC",
  dallas: "AL AR IA MO TX",
  delaware: "IN IA NY OH OK PA",
  denver: "CO",
  "el paso": "CO TX",
  fresno: "CA",
  hartford: "CT",
  hawaii: "HI",
  houston: "AL GA MN TN TX",
  idaho: "ID",
  indiana: "PA",
  iowa: "IA WI",
  "los angeles": "CA",
  mesa: "CO",
  miami: "IN KS OH",
  milwaukee: "WI",
  mississippi: "AR MO",
  nevada: "AR CA",
  "new york": "NY",
  oakland: "MI",
  ohio: "IN KY WV",
  oklahoma: "OK",
  oregon: "MO",
  philadelphia: "PA",
  providence: "RI",
  raleigh: "WV",
  richmond: "GA NY NC VA",
  sacramento: "CA",
  "san diego": "CA",
  "san francisco": "CA",
  texas: "MO OK",
  utah: "UT",
  washington: "AL AR CO FL GA ID IL IN IA KS KY ME MD MN MS MO NE NY NC OH OK OR PA RI TN TX UT VT VA WI",
  wyoming: "NY PA WV",
};

/**
 * "Washington, D.C.", "Washington DC" or "D.C." mean the District, not Washington state.
 */
const WASHINGTON_DC = /\bwashington,?\s+d\.?\s?c\b|\bd\.\s?c\./gi;

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

const CITY_PATTERNS = [
  ...Object.entries(MAJOR_CITIES).map(([city, state]) => [namePattern(city), city, state] as const),
  ...Object.entries(CITY_ALIASES).map(([alias, city]) => [namePattern(alias), city, MAJOR_CITIES[city]] as const),
];
const STATE_PATTERNS = Object.entries(US_STATES).map(([name, abbrev]) => [namePattern(name), abbrev] as const);

/**
 * Words that make a place's name part of a street or neighbourhood name ("Washington Heights", "Idaho Avenue"),
 * and a county's name ("Delaware County", "Arlington County"), which is looked up in COUNTIES instead.
 */
const STREET_TYPES = ["street", "st", "avenue", "ave", "road", "rd", "boulevard", "blvd"];
const STREET_WORDS = [...STREET_TYPES, "heights", "district", "park", "bridge", "square"];
const NOT_AFTER_CITY = new Set([...STREET_WORDS, "county"]);
const NOT_AFTER_STATE = new Set([...STREET_WORDS, "county", "co"]);

/**
 * The capitalised word right after a match, in lower case ("heights" after "Washington Heights").
 */
function nextWord(text: string, match: RegExpExecArray): string | undefined {
  return text.slice(match.index + match[0].length).match(/^\s+([A-Z][A-Za-z]*)/)?.[1].toLowerCase();
}

/**
 * Where a place's name stands for the place: not before a capitalised word in `notAfter`. A lower-case word
 * doesn't count against it ("crash on Kansas road", "a rural Iowa county").
 */
function placeMatches(text: string, pattern: RegExp, notAfter: Set<string>): RegExpExecArray[] {
  return [...text.matchAll(pattern)].filter((match) => {
    const next = nextWord(text, match);
    return !next || !notAfter.has(next);
  });
}

/**
 * Words after a place that make it where someone is from ("New Hampshire man", "Lexington, Ky., woman",
 * "Iowa City teen"), not where the crash was.
 */
const HOME_NEXT =
  /^(\s+city)?,?\s+(man|men|woman|women|driver|drivers|teen|teens|teenager|teenagers|boy|boys|girl|girls|resident|residents|motorcyclist|bicyclist|cyclist|couple|family|mother|father|mom|dad|native|student)\b/i;

/**
 * A state code counts, except that one that is also a word ("ID released", an all-caps "CRASH IN", "South LA",
 * "ID'd", "OK's") counts only after a comma and not before an apostrophe.
 */
function isStateCode(code: string, comma?: string, apostrophe?: string): boolean {
  return US_STATE_ABBREVIATIONS.has(code) && (!AMBIGUOUS_STATE_ABBREVIATIONS.has(code) || (!!comma && !apostrophe));
}

const AP_STATE = Object.keys(AP_STATES)
  .map((abbreviation) => abbreviation.replace(/\./g, "\\."))
  .join("|");
const STATE_NAME_NEXT = new RegExp(`^,?\\s+(${Object.keys(US_STATES).join("|")})\\b`, "i");
const AP_STATE_NEXT = new RegExp(`^,?\\s+(${AP_STATE})(?![A-Za-z])`);
const STATE_CODE_NEXT = /^(,)\s*([A-Z]{2})\b(['’])?/;
const STATE_CODE = new RegExp(`,\\s*(${AP_STATE})(?![A-Za-z])|(,\\s*)?\\b([A-Z]{2})\\b(['’])?`, "g");

/**
 * The state written right after a city's name: "Arlington, Virginia", "Aurora Illinois", "Arlington, Va." or
 * "Arlington, VA", and how long that is. A code counts only after a comma, so "Miami DE Rueben Bain" (a defensive
 * end) is not Delaware.
 */
function stateAfter(rest: string): [state: string | undefined, length: number] {
  const name = rest.match(STATE_NAME_NEXT);
  if (name) return [US_STATES[name[1].toLowerCase().replace(/\s+/g, " ")], name[0].length];
  const ap = rest.match(AP_STATE_NEXT);
  if (ap) return [AP_STATES[ap[1]], ap[0].length];
  const code = rest.match(STATE_CODE_NEXT);
  return code && isStateCode(code[2], code[1], code[3]) ? [code[2], code[0].length] : [undefined, 0];
}

/**
 * The first state code in the text ("in TX", "Boise, ID") or AP abbreviation after a comma ("Lexington, Ky."),
 * where `counts` accepts the text after it.
 */
function stateCode(text: string, counts: (rest: string) => boolean = () => true): string | undefined {
  for (const match of text.matchAll(STATE_CODE)) {
    const [whole, ap, comma, code, apostrophe] = match;
    const state = ap ? AP_STATES[ap] : isStateCode(code, comma, apostrophe) ? code : undefined;
    if (state && counts(text.slice(match.index + whole.length))) return state;
  }
  return undefined;
}

/**
 * The states that have the first county named with a capitalised "County" ("Utah County", "WASHINGTON COUNTY")
 * that is in COUNTIES, or undefined when there is none.
 */
function countyStates(text: string): string[] | undefined {
  for (const [, words] of text.matchAll(/\b((?:[A-Za-z]+\s+)?[A-Za-z]+)\s+(?:County|COUNTY)\b/g)) {
    const name = words.toLowerCase().replace(/\s+/g, " ");
    const states = COUNTIES[name] ?? COUNTIES[name.replace(/^\S+ /, "")];
    if (states) return states.split(" ");
  }
  return undefined;
}

/**
 * The state of a city a street is named after ("Las Vegas Boulevard"), which is not the city itself.
 */
function streetCityState(text: string): string | undefined {
  const streetTypes = new Set(STREET_TYPES);
  for (const [pattern, , state] of CITY_PATTERNS) {
    if ([...text.matchAll(pattern)].some((match) => streetTypes.has(nextWord(text, match) ?? ""))) return state;
  }
  return undefined;
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
 * Extracts city and state from text using known locations. A place someone is from ("Texas man") counts only
 * with `withHome`.
 */
function extractLocation(text: string, withHome = false): { city?: string; state?: string } {
  const counts = (rest: string) => withHome || !HOME_NEXT.test(rest);
  const after = (match: RegExpExecArray) => text.slice(match.index + match[0].length);

  // Try to find a major city first
  for (const [pattern, city, state] of CITY_PATTERNS) {
    const written = placeMatches(text, pattern, NOT_AFTER_CITY).flatMap((match) => {
      const [named, length] = stateAfter(after(match));
      return counts(after(match).slice(length)) ? [named] : [];
    });
    if (written.length > 0) {
      // Capitalize city name properly
      const capitalizedCity = city
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      // A state written after the city wins: "Arlington, Virginia" is not Arlington, Texas.
      return { city: capitalizedCity, state: written.find(Boolean) ?? state };
    }
  }

  if ([...text.matchAll(WASHINGTON_DC)].some((match) => counts(after(match)))) {
    return { city: "Washington", state: "DC" };
  }

  // Try to find a state name
  for (const [pattern, abbrev] of STATE_PATTERNS) {
    if (placeMatches(text, pattern, NOT_AFTER_STATE).some((match) => counts(after(match)))) {
      return { state: abbrev };
    }
  }

  // Try to find a state abbreviation (e.g., "in TX", "Boise, ID" or "Lexington, Ky.").
  const code = stateCode(text, counts);
  return code ? { state: code } : {};
}

/**
 * National outlets, whose names say nothing about where a story happened ("New York Post", "Yahoo News Canada").
 */
const NATIONAL_OUTLET =
  /^(the )?(new york post|new york times|nytimes(\.com)?|usa today|associated press( news)?|ap( news)?|reuters|fox news|cnn|nbc news|abc news|cbs news|yahoo\b.*|msn(\.com)?|daily mail( online)?|mail online|independent|newsweek)$/i;

/**
 * Home states of publishers named after their city, whose names give no state ("The Portland Press Herald" is in
 * Maine, the "Kansas City Star" in Missouri).
 */
const CITY_PUBLISHER_STATES: Record<string, string> = {
  "baltimore sun": "MD",
  "foxbaltimore.com": "MD",
  "boston herald": "MA",
  "the boston globe": "MA",
  "cwb chicago": "IL",
  "chicago sun-times": "IL",
  "chicagotribune.com": "IL",
  "nbcchicago.com": "IL",
  "streetsblog chicago": "IL",
  "city of los angeles (.gov)": "CA",
  "fox 11 los angeles": "CA",
  "los angeles daily news": "CA",
  "los angeles times": "CA",
  "the voice of black los angeles": "CA",
  "long beach post": "CA",
  "long beach watchdog": "CA",
  "fox 5 san diego & kusi news": "CA",
  "san diego union-tribune": "CA",
  "san francisco chronicle": "CA",
  "the oaklandside": "CA",
  "sacramento bee": "CA",
  "cleveland jewish news": "OH",
  "news 5 cleveland wews": "OH",
  "the columbus dispatch": "OH",
  "cwcolumbus.com": "OH",
  "myfox28columbus.com": "OH",
  "dallas express": "TX",
  "dallas news": "TX",
  "dallasnews.com": "TX",
  "el paso times": "TX",
  "fort worth star-telegram": "TX",
  "houston chronicle": "TX",
  "kxan austin": "TX",
  "san antonio express-news": "TX",
  "deadline detroit": "MI",
  "detroit free press": "MI",
  "detroitnews.com": "MI",
  "fox 2 detroit": "MI",
  "denver gazette": "CO",
  "the denver post": "CO",
  "denverpost.com": "CO",
  "fox 29 philadelphia": "PA",
  "pittsburgh post-gazette": "PA",
  "wtae pittsburgh": "PA",
  "fox13 memphis": "TN",
  "news channel 5 nashville": "TN",
  "greater milwaukee today": "WI",
  "milwaukee journal sentinel": "WI",
  "hartford courant": "CT",
  "kiro 7 news seattle": "WA",
  "seattle.gov": "WA",
  "seattlepi.com": "WA",
  "west seattle blog...": "WA",
  "ktnv las vegas": "NV",
  "kansas city star": "MO",
  "miami herald": "FL",
  "miamiherald.com": "FL",
  "nbcmiami.com": "FL",
  "orlando sentinel": "FL",
  "orlandosentinel.com": "FL",
  "tampa bay times": "FL",
  "jacksonville.com": "FL",
  "raleigh news & observer": "NC",
  "wccb charlotte": "NC",
  "richmond times-dispatch": "VA",
  "foxrichmond.com": "VA",
  "streetsblog new york city": "NY",
  "the portland press herald": "ME",
  "the providence journal": "RI",
};

/**
 * Home states of the publishers read directly and of those named after their city, by the name Google News gives
 * them.
 */
const KNOWN_PUBLISHERS = new Map<string, string | null>([
  ...Object.entries(CITY_PUBLISHER_STATES),
  ...PUBLISHER_FEEDS.map((feed) => [feed.name.toLowerCase(), feed.state] as const),
]);

const STATE_NAMED_CITY = new RegExp(`\\b(${Object.keys(US_STATES).join("|")})\\s+city\\b`, "gi");

/**
 * The state a publisher points to, for a story that names no place itself: its home state if it is known ("ABC7
 * Chicago", "Baltimore Sun"), else a state its name gives ("Portland, ME Patch", "FOX21 News Colorado", "NJ.com").
 * Brands run names together, so state names count inside words here. A city in the name gives no state ("The
 * Portland Press Herald" is in Maine), nor does "Washington" (the Washington Post, Times and Examiner are in the
 * District) or a city named after a state ("Kansas City Star"). National outlets give no state.
 */
function publisherState(name: string): string | undefined {
  const known = KNOWN_PUBLISHERS.get(name.trim().toLowerCase());
  if (known !== undefined) return known ?? undefined;
  if (NATIONAL_OUTLET.test(name.trim())) return undefined;
  const written = name.match(/,\s*([A-Z]{2})\b/)?.[1];
  if (written && US_STATE_ABBREVIATIONS.has(written)) return written;
  const brand = name.replace(/washington/gi, " ").replace(STATE_NAMED_CITY, " ");
  const lower = brand.toLowerCase();
  for (const [place, state] of Object.entries(US_STATES)) {
    if (lower.includes(place)) return state;
  }
  return stateCode(brand);
}

/**
 * Where a story happened: a place it names, else a county only one state has ("Utah County"), else the
 * publisher's state (for a county several states have, only if that state has one), else the state of a city a
 * street is named after ("Las Vegas Boulevard"), else where someone in it is from ("Texas man").
 */
function storyLocation(item: GoogleNewsItem, homeState?: string): { city?: string; state?: string } {
  const text = storyText(item);
  const found = extractLocation(text);
  if (found.state) return found;

  const county = countyStates(text);
  if (county?.length === 1) return { state: county[0] };

  // A story that names no place is placed in its publisher's state ("ABC7 Chicago" in Illinois), not its city.
  const publisher = homeState ?? (item.source ? publisherState(item.source) : undefined);
  const home = extractLocation(text, true);
  if (publisher && (!county || county.includes(publisher))) {
    return home.state === publisher ? home : { state: publisher };
  }

  const street = streetCityState(text);
  return street ? { state: street } : home;
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
    const location = storyLocation(item, homeState);

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
