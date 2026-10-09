import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

/**
 * Reads generic scene cues from an incident: vehicle classes, road type, time of day, weather and season.
 * Only this fixed vocabulary reaches the image prompt. Names, places, brands and other identifying
 * details from the article never do.
 */

export type Time = "day" | "dawn" | "dusk" | "night";
export type Weather = "clear" | "rain" | "snow" | "fog";
export type Season = "winter" | "spring" | "summer" | "autumn";
export type Road = "interstate" | "freeway" | "highway" | "intersection" | "rural" | "city";

export interface SceneInput {
  headline: string;
  articleBody: string | null;
  extractedFacts: AccidentFacts | null;
  occurredAt: Date;
}

export interface SceneCues {
  vehicles: string[];
  road: Road;
  crosswalk: boolean;
  bridge: boolean;
  tunnel: boolean;
  /** Null when the article doesn't say, so the picture is free to vary. */
  time: Time | null;
  weather: Weather | null;
  season: Season;
}

const VEHICLE_RULES: [RegExp, string][] = [
  [/motorcycl|motorbike|\bmoped|\bscooter/, "motorcycle"],
  [/\bsemi\b|semi-truck|tractor[- ]trailer|18-wheeler|big rig|commercial truck|freight truck|tanker/, "semi-truck"],
  [/box truck|delivery truck|moving truck|dump truck|garbage truck|cement truck/, "box truck"],
  [/pickup/, "pickup truck"],
  [/\bbus\b|school bus|transit bus/, "bus"],
  [/\bsuv\b/, "SUV"],
  [/\bvan\b|minivan/, "van"],
  [/\btruck\b/, "truck"],
  [/bicycl|\bbike\b|cyclist/, "bicycle"],
  [/\bcar\b|sedan|vehicle|coupe|hatchback/, "car"],
];

function vehicleClasses(text: string, facts: AccidentFacts | null): string[] {
  const found: string[] = [];
  const add = (cls: string) => {
    if (found.length < 2) found.push(cls);
  };
  for (const v of facts?.vehicles ?? []) {
    const t = typeof v?.type === "string" ? v.type.toLowerCase() : "";
    const rule = VEHICLE_RULES.find(([re]) => re.test(t));
    if (rule) add(rule[1]);
  }
  if (found.length === 0) {
    for (const [re, cls] of VEHICLE_RULES) {
      if (re.test(text) && !found.includes(cls)) add(cls);
    }
  }
  return found;
}

function roadType(text: string): Road {
  if (/\bi-\d+|\binterstate\b/.test(text)) return "interstate";
  if (/freeway|expressway|turnpike|parkway|beltway/.test(text)) return "freeway";
  if (/\bhighway\b|\bhwy\b|\bus[- ]?\d+|\bsr[- ]?\d+|state route|\broute \d+/.test(text)) return "highway";
  if (/intersection/.test(text)) return "intersection";
  if (/rural|county road|country road|farm/.test(text)) return "rural";
  return "city";
}

function timeOfDay(text: string): Time | null {
  const clock = text.match(/\b(\d{1,2})(?::\d{2})?\s*(a\.?m\.?|p\.?m\.?)/);
  if (clock) {
    let hour = Number(clock[1]) % 12;
    if (clock[2].startsWith("p")) hour += 12;
    if (hour < 5 || hour >= 21) return "night";
    if (hour < 7) return "dawn";
    if (hour < 17) return "day";
    return "dusk";
  }
  if (/overnight|midnight|late-night|late night|after dark|\bnight\b/.test(text)) return "night";
  if (/\bdawn\b|sunrise|early morning|early-morning/.test(text)) return "dawn";
  if (/\bdusk\b|sunset|\bevening\b/.test(text)) return "dusk";
  return null;
}

function weather(text: string): Weather | null {
  if (/\bsnow|\bicy\b|black ice|\bsleet|blizzard|winter storm/.test(text)) return "snow";
  if (/\brain|wet road|wet pavement|downpour|hydroplan|thunderstorm/.test(text)) return "rain";
  if (/\bfog/.test(text)) return "fog";
  return null;
}

// Seasons as they fall in the United States.
function season(date: Date): Season {
  const month = date.getUTCMonth();
  if (month === 11 || month <= 1) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "autumn";
}

export function sceneCues({ headline, articleBody, extractedFacts, occurredAt }: SceneInput): SceneCues {
  const text = [
    headline,
    extractedFacts?.primaryLocation,
    ...(extractedFacts?.roads ?? []),
    extractedFacts?.timeOfCrashApprox,
    extractedFacts?.causeOrAllegations,
    ...(extractedFacts?.vehicles ?? []).map((v) => v?.type),
    articleBody?.slice(0, 3000),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    vehicles: vehicleClasses(text, extractedFacts),
    road: roadType(text),
    crosswalk: /pedestrian|crosswalk/.test(text),
    bridge: /\bbridge\b|overpass|viaduct/.test(text),
    tunnel: /\btunnel\b/.test(text),
    time: timeOfDay(text),
    weather: weather(text),
    season: season(occurredAt),
  };
}
