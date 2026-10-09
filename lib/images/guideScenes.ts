import type { Season } from "@/lib/images/scene";

/**
 * Generic scenery for the crash-report guide heroes, keyed by guide slug. Terrain and climate only:
 * no landmarks, seals, flags, badges or agency logos. The framing comes from the composition list.
 */
export interface GuidePlace {
  place: string;
  /** City scenery gets city compositions. */
  urban?: boolean;
  /** Set where the scenery itself implies a season; otherwise summer. */
  season?: Season;
}

export const GUIDE_INDEX_PLACE: GuidePlace = { place: "open countryside under a wide sky" };

export const GUIDE_PLACES: Record<string, GuidePlace> = {
  alabama: { place: "tall pine forest" },
  alaska: { place: "snow-capped peaks and spruce trees", season: "winter" },
  arizona: { place: "desert with tall cacti and red rock mesas far away" },
  arkansas: { place: "forested rolling hills" },
  california: { place: "coastal cliffs above the ocean" },
  colorado: { place: "pine trees below snowy peaks" },
  connecticut: { place: "woods and low stone walls", season: "autumn" },
  delaware: { place: "flat coastal marshland" },
  "district-of-columbia": { place: "brick rowhouses", urban: true },
  florida: { place: "palm trees near the coast" },
  georgia: { place: "pine trees and red clay" },
  hawaii: { place: "tropical plants and green volcanic hills" },
  idaho: { place: "a river canyon beside farmland" },
  illinois: { place: "flat cornfields" },
  indiana: { place: "farm fields and a red barn" },
  iowa: { place: "rolling cornfields" },
  kansas: { place: "golden wheat fields under a big sky" },
  kentucky: { place: "wooden horse-farm fences and green hills" },
  louisiana: { place: "bayou wetlands with cypress trees" },
  maine: { place: "pine trees and a rocky shoreline" },
  maryland: { place: "a calm bay shoreline" },
  massachusetts: { place: "brick buildings and old trees", urban: true, season: "autumn" },
  michigan: { place: "birch trees beside a large lake" },
  minnesota: { place: "evergreen trees and frozen fields", season: "winter" },
  mississippi: { place: "cotton fields and spreading oak trees" },
  missouri: { place: "a wide river with wooded bluffs" },
  montana: { place: "open prairie and distant mountains" },
  nebraska: { place: "prairie and grain silos" },
  nevada: { place: "sagebrush desert and bare mountains" },
  "new-hampshire": { place: "wooded mountains", season: "autumn" },
  "new-jersey": { place: "suburban towns", urban: true },
  "new-mexico": { place: "mesas and adobe-colored hills" },
  "new-york": { place: "tall city buildings", urban: true },
  "north-carolina": { place: "forested ridges" },
  "north-dakota": { place: "wheat fields and wind turbines" },
  ohio: { place: "farmland and small towns" },
  oklahoma: { place: "red-earth plains and wind turbines" },
  oregon: { place: "tall evergreen forest" },
  pennsylvania: { place: "rolling forested hills and farmland" },
  "rhode-island": { place: "a small harbor with sailboats" },
  "south-carolina": { place: "palmetto trees and marshland" },
  "south-dakota": { place: "grassland and rocky hills" },
  tennessee: { place: "green mountains and valleys" },
  texas: { place: "open plains under a big sky" },
  utah: { place: "red rock canyons" },
  vermont: { place: "farmhouses and maple trees", season: "winter" },
  virginia: { place: "rolling hills and blue mountains" },
  washington: { place: "evergreen forest and distant mountains" },
  "west-virginia": { place: "dense forest on steep mountains" },
  wisconsin: { place: "dairy farms and red barns" },
  wyoming: { place: "high plains and distant mountains" },
};

/** Compositions that suit a guide hero; the emergency, closed-lane and snow scenes don't. */
export const GUIDE_COMPOSITIONS = [
  "aerial-road",
  "wide-landscape",
  "interchange",
  "empty-curve",
  "rear-three-quarter",
  "empty-bridge",
  "rural-two-lane",
  "on-ramp",
  "dusk-highway",
  "tunnel-mouth",
];
export const GUIDE_URBAN_COMPOSITIONS = ["aerial-intersection", "intersection-corner", "rain-street", "empty-bridge"];
