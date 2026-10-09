import type { AccidentFacts } from "@/lib/seo/extractAccidentFacts";

/**
 * Builds a generic illustration scene from an incident. Only fixed vocabulary
 * reaches the image prompt: vehicle classes, road type, time of day and weather.
 * Names, places, brands and other identifying details from the article never do.
 */

export interface SceneInput {
  headline: string;
  articleBody: string | null;
  extractedFacts: AccidentFacts | null;
}

export interface Scene {
  description: string;
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

function vehiclePhrase(classes: string[]): string {
  if (classes.length === 0) return "two cars";
  if (classes.length === 1) return `${/^[aeiou]/i.test(classes[0]) ? "an" : "a"} ${classes[0]}`;
  if (classes[0] === classes[1]) return `two ${classes[0]}s`;
  return classes.map((c) => `${/^[aeiou]/i.test(c) ? "an" : "a"} ${c}`).join(" and ");
}

function roadType(text: string, pedestrian: boolean): string {
  if (pedestrian) return "city street with a crosswalk";
  if (/\bi-\d+|\binterstate\b/.test(text)) return "multi-lane interstate highway";
  if (/freeway|expressway|turnpike|parkway|beltway/.test(text)) return "multi-lane freeway";
  if (/\bhighway\b|\bhwy\b|\bus[- ]?\d+|\bsr[- ]?\d+|state route|\broute \d+/.test(text)) return "two-lane highway";
  if (/intersection/.test(text)) return "city intersection with traffic lights";
  if (/rural|county road|country road|farm/.test(text)) return "rural two-lane road";
  return "city street";
}

function timeOfDay(text: string): string {
  const clock = text.match(/\b(\d{1,2})(?::\d{2})?\s*(a\.?m\.?|p\.?m\.?)/);
  if (clock) {
    let hour = Number(clock[1]) % 12;
    if (clock[2].startsWith("p")) hour += 12;
    if (hour < 5 || hour >= 21) return "at night";
    if (hour < 7) return "at dawn";
    if (hour < 17) return "in daylight";
    return "at dusk";
  }
  if (/overnight|midnight|late-night|late night|after dark|\bnight\b/.test(text)) return "at night";
  if (/\bdawn\b|sunrise|early morning|early-morning/.test(text)) return "at dawn";
  if (/\bdusk\b|sunset|\bevening\b/.test(text)) return "at dusk";
  return "in daylight";
}

function weather(text: string): string | null {
  if (/\bsnow|\bicy\b|black ice|\bsleet|blizzard|winter storm/.test(text)) return "snowy";
  if (/\brain|wet road|wet pavement|downpour|hydroplan|thunderstorm/.test(text)) return "rainy";
  if (/\bfog/.test(text)) return "foggy";
  return null;
}

export function buildScene({ headline, articleBody, extractedFacts }: SceneInput): Scene {
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

  const pedestrian = /pedestrian|crosswalk/.test(text);
  const classes = vehicleClasses(text, extractedFacts);
  const vehicles = vehiclePhrase(pedestrian && classes.length === 0 ? ["car"] : classes);
  const road = roadType(text, pedestrian);
  const time = timeOfDay(text);
  const sky = weather(text);
  const roadWithWeather = sky ? `${sky} ${road}` : road;

  return { description: `${vehicles} stopped on a ${roadWithWeather} ${time}` };
}
