import type { Road, SceneCues, Season, Time, Weather } from "@/lib/images/scene";

/** How vehicles may appear: not at all, as roofs from above, small and far away, from behind, or only as lights. */
export type Framing = "none" | "above" | "distant" | "rear" | "lights";

export interface Composition {
  name: string;
  label: string;
  setting: string;
  framing: Framing;
  /** Roads this composition suits best. */
  roads: Road[];
  /** The composition's own time or weather, used when the article doesn't say. */
  time?: Time;
  weather?: Weather;
  /** The only times or weathers it can show; an article that states another one rules it out. */
  times?: Time[];
  weathers?: Weather[];
}

export const COMPOSITIONS: Composition[] = [
  {
    name: "aerial-road",
    label: "Aerial view of a road",
    setting: "a high aerial view looking straight down at a road with lane markings",
    framing: "above",
    roads: ["interstate", "freeway", "highway", "rural"],
  },
  {
    name: "aerial-intersection",
    label: "Aerial view of an intersection",
    setting: "a high aerial view looking straight down at a city intersection with crosswalk stripes",
    framing: "above",
    roads: ["intersection", "city"],
  },
  {
    name: "interchange",
    label: "Motorway interchange from above",
    setting: "a motorway interchange seen from high above, its ramps curving over and under each other",
    framing: "above",
    roads: ["interstate", "freeway"],
  },
  {
    name: "wide-landscape",
    label: "Wide landscape, distant vehicles",
    setting: "a wide landscape where the road is a thin ribbon crossing open country",
    framing: "distant",
    roads: ["highway", "rural", "interstate"],
  },
  {
    name: "empty-curve",
    label: "Empty road curving away",
    setting: "an empty road curving away into the distance",
    framing: "none",
    roads: ["rural", "highway"],
  },
  {
    name: "empty-bridge",
    label: "Empty bridge",
    setting: "an empty road bridge crossing a wide river",
    framing: "none",
    roads: ["highway", "interstate", "freeway", "city"],
  },
  {
    name: "on-ramp",
    label: "Empty on-ramp",
    setting: "an empty on-ramp curving up to join a highway",
    framing: "none",
    roads: ["interstate", "freeway", "highway"],
  },
  {
    name: "tunnel-mouth",
    label: "Tunnel mouth",
    setting: "the mouth of a road tunnel cut into a hillside, with the empty road leading inside",
    framing: "none",
    roads: ["highway", "interstate", "freeway"],
  },
  {
    name: "intersection-corner",
    label: "Intersection from a high corner",
    setting: "an intersection with traffic lights seen from a high corner above the street",
    framing: "distant",
    roads: ["intersection", "city"],
  },
  {
    name: "rear-three-quarter",
    label: "Rear three-quarter view at a distance",
    setting: "a road stretching ahead, seen from slightly above and behind a vehicle some distance away",
    framing: "rear",
    roads: ["highway", "interstate", "freeway", "rural", "city"],
  },
  {
    name: "emergency-lights",
    label: "Emergency lights at night",
    setting:
      "a dark roadside lit by the red and blue glow of parked emergency vehicle lights, the vehicles only simple dark shapes with no markings or text",
    framing: "lights",
    roads: ["highway", "interstate", "freeway", "city", "rural", "intersection"],
    time: "night",
    times: ["night", "dusk"],
  },
  {
    name: "closed-lane",
    label: "Closed lane with cones",
    setting: "a highway lane closed off by a row of orange traffic cones and a blank warning sign with nothing written on it",
    framing: "none",
    roads: ["interstate", "freeway", "highway"],
  },
  {
    name: "rain-street",
    label: "Rain-soaked street",
    setting: "a rain-soaked city street with long reflections on the wet pavement",
    framing: "distant",
    roads: ["city", "intersection"],
    weather: "rain",
    weathers: ["rain"],
  },
  {
    name: "snow-road",
    label: "Snow-covered road",
    setting: "a snow-covered road with tire tracks between snowy banks",
    framing: "distant",
    roads: ["rural", "highway", "interstate"],
    weather: "snow",
    weathers: ["snow"],
  },
  {
    name: "dusk-highway",
    label: "Highway at dusk with headlights",
    setting: "a highway where the traffic shows only as pairs of headlights and taillights",
    framing: "lights",
    roads: ["interstate", "freeway", "highway"],
    time: "dusk",
    times: ["dusk", "night"],
  },
  {
    name: "rural-two-lane",
    label: "Rural two-lane road",
    setting: "a rural two-lane road running between fields and fence posts",
    framing: "distant",
    roads: ["rural", "highway"],
  },
];

export function compositionByName(name: string): Composition | undefined {
  return COMPOSITIONS.find((c) => c.name === name);
}

/** FNV-1a: a small, stable number from a string, so the same incident always gets the same choices. */
export function seedOf(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function fits(c: Composition, cues: SceneCues): boolean {
  if (c.times && cues.time && !c.times.includes(cues.time)) return false;
  if (c.weathers && cues.weather && !c.weathers.includes(cues.weather)) return false;
  // Snow the article doesn't mention only makes sense in winter.
  if (c.weather === "snow" && !cues.weather && cues.season !== "winter") return false;
  return true;
}

function affinity(c: Composition, cues: SceneCues): number {
  let score = c.roads.includes(cues.road) ? 2 : 0;
  if (cues.crosswalk && (c.name === "aerial-intersection" || c.name === "intersection-corner")) score += 2;
  if (cues.bridge && c.name === "empty-bridge") score += 3;
  if (cues.tunnel && c.name === "tunnel-mouth") score += 3;
  if (cues.weather && c.weather === cues.weather) score += 3;
  if (cues.time && c.time === cues.time) score += 2;
  return score;
}

/**
 * Picks the composition for one image. It is never one of the last 10 used (`recent`, newest first) or one
 * in `exclude`; among the rest it prefers what suits the article, then what was used longest ago, and the
 * seed breaks ties so similar incidents don't always land on the same picture.
 */
export function pickComposition(cues: SceneCues, recent: string[], seed: number, exclude: string[] = []): Composition {
  const blocked = new Set([...recent.slice(0, 10), ...exclude]);
  const open = COMPOSITIONS.filter((c) => !blocked.has(c.name));
  const suited = open.filter((c) => fits(c, cues));
  const choices = suited.length > 0 ? suited : open.length > 0 ? open : COMPOSITIONS.filter((c) => !exclude.includes(c.name));
  const lastUsed = (c: Composition) => {
    const i = recent.indexOf(c.name);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...choices].sort(
    (a, b) =>
      affinity(b, cues) - affinity(a, cues) ||
      lastUsed(b) - lastUsed(a) ||
      seedOf(`${seed}:${a.name}`) - seedOf(`${seed}:${b.name}`)
  )[0];
}

export interface Look {
  time: Time;
  weather: Weather;
  season: Season;
}

const VARIED_TIMES: Time[] = ["day", "day", "dusk", "day", "dawn", "night"];
const VARIED_WEATHER: Weather[] = ["clear", "clear", "rain", "fog"];
const VARIED_WINTER_WEATHER: Weather[] = ["clear", "snow", "clear", "fog"];

/**
 * Time, weather and season for a picture: the article's where it says and the composition can show it,
 * otherwise the composition's own, otherwise varied by the seed.
 */
export function lookFor(c: Composition, cues: SceneCues, seed: number): Look {
  const time =
    cues.time && (!c.times || c.times.includes(cues.time)) ? cues.time : c.time ?? VARIED_TIMES[seed % VARIED_TIMES.length];
  const varied = cues.season === "winter" ? VARIED_WINTER_WEATHER : VARIED_WEATHER;
  const weather =
    cues.weather && (!c.weathers || c.weathers.includes(cues.weather))
      ? cues.weather
      : c.weather ?? varied[(seed >>> 4) % varied.length];
  return { time, weather, season: weather === "snow" ? "winter" : cues.season };
}
