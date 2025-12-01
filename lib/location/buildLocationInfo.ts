/**
 * Centralized location resolution helper for AccidentFacts.
 *
 * This module provides a single source of truth for computing display locations
 * from various data sources (extracted facts, database fields, etc.).
 *
 * Resolution priority (tier 1 = most specific):
 * 1. extractedFacts.primaryLocation (e.g., "Near Exit 23 on I-240 in Memphis, Tennessee")
 * 2. Database city/state + road from facts (e.g., "I-85, Atlanta, GA")
 * 3. Roads from extracted facts + city/state from facts
 * 4. City/state from extracted facts or database
 * 5. "Location not specified" (fallback)
 */

export type LocationResolutionTier = 1 | 2 | 3 | 4 | 5;

export interface LocationInfo {
  /** Full display location for headers and Quick Facts */
  displayLocation: string;
  /** Shorter version (city, state only) for compact displays */
  shortLocation: string | null;
  /** City extracted or from database */
  city: string | null;
  /** State extracted or from database */
  state: string | null;
  /** Which priority tier was used (1 = most specific, 5 = fallback) */
  resolutionTier: LocationResolutionTier;
}

export interface ExtractedFactsInput {
  primaryLocation?: string | null;
  roads?: string[] | null;
  city?: string | null;
  state?: string | null;
}

export interface BuildLocationParams {
  extractedFacts?: ExtractedFactsInput | null;
  dbCity?: string | null;
  dbState?: string | null;
}

/**
 * Build location info using priority-based resolution.
 *
 * @param params - Object containing extractedFacts and database city/state
 * @returns LocationInfo with displayLocation, shortLocation, city, state, and resolutionTier
 */
export function buildLocationInfo(params: BuildLocationParams): LocationInfo {
  const { extractedFacts, dbCity, dbState } = params;

  // Determine the best city and state values
  const city = dbCity || extractedFacts?.city || null;
  const state = dbState || extractedFacts?.state || null;

  // Build short location (just city, state)
  const shortLocation = [city, state].filter(Boolean).join(", ") || null;

  // Tier 1: extracted primary location (most specific)
  if (extractedFacts?.primaryLocation) {
    return {
      displayLocation: extractedFacts.primaryLocation,
      shortLocation,
      city,
      state,
      resolutionTier: 1,
    };
  }

  // Tier 2: city/state from database + road from facts
  const dbCityState = [dbCity, dbState].filter(Boolean).join(", ");
  if (dbCityState) {
    if (extractedFacts?.roads && extractedFacts.roads.length > 0) {
      return {
        displayLocation: `${extractedFacts.roads[0]}, ${dbCityState}`,
        shortLocation: dbCityState,
        city: dbCity || null,
        state: dbState || null,
        resolutionTier: 2,
      };
    }
    // Just city/state from database (still tier 2 since DB data is reliable)
    return {
      displayLocation: dbCityState,
      shortLocation: dbCityState,
      city: dbCity || null,
      state: dbState || null,
      resolutionTier: 2,
    };
  }

  // Tier 3: roads from extracted facts + city/state from facts
  if (extractedFacts?.roads && extractedFacts.roads.length > 0) {
    const factsCityState = [extractedFacts.city, extractedFacts.state]
      .filter(Boolean)
      .join(", ");
    if (factsCityState) {
      return {
        displayLocation: `${extractedFacts.roads[0]}, ${factsCityState}`,
        shortLocation: factsCityState,
        city: extractedFacts.city || null,
        state: extractedFacts.state || null,
        resolutionTier: 3,
      };
    }
    // Just roads (tier 3)
    return {
      displayLocation: extractedFacts.roads.join(", "),
      shortLocation: null,
      city: null,
      state: null,
      resolutionTier: 3,
    };
  }

  // Tier 4: city/state from extracted facts only
  const factsCityState = [extractedFacts?.city, extractedFacts?.state]
    .filter(Boolean)
    .join(", ");
  if (factsCityState) {
    return {
      displayLocation: factsCityState,
      shortLocation: factsCityState,
      city: extractedFacts?.city || null,
      state: extractedFacts?.state || null,
      resolutionTier: 4,
    };
  }

  // Tier 5: fallback
  return {
    displayLocation: "Location not specified",
    shortLocation: null,
    city: null,
    state: null,
    resolutionTier: 5,
  };
}

/**
 * Log location resolution for debugging and analytics.
 *
 * @param identifier - Incident slug or ID for identification
 * @param locationInfo - The resolved LocationInfo
 */
export function logLocationResolution(
  identifier: string,
  locationInfo: LocationInfo
): void {
  console.info(
    `[Location Resolution] ${identifier}: tier=${locationInfo.resolutionTier}, ` +
      `location="${locationInfo.displayLocation}", ` +
      `city="${locationInfo.city || "none"}", state="${locationInfo.state || "none"}"`
  );
}
