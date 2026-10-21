export interface CityPage {
  name: string;
  state: string;
  slug: string;
}

/**
 * Cities that get their own page at /accidents/<state>/<slug>: each had at least 25 incidents whose headline
 * names the city on 2026-10-20. A city's page lists only those incidents.
 */
const CITIES: [state: string, name: string][] = [
  ["TX", "Houston"], ["CA", "Los Angeles"], ["AZ", "Phoenix"], ["IL", "Chicago"], ["FL", "Miami"],
  ["CA", "Sacramento"], ["CO", "Denver"], ["TX", "Dallas"], ["NV", "Las Vegas"], ["CA", "San Jose"],
  ["PA", "Philadelphia"], ["GA", "Atlanta"], ["NC", "Charlotte"], ["AZ", "Tucson"], ["TX", "San Antonio"],
  ["TX", "Austin"], ["WI", "Milwaukee"], ["CA", "Long Beach"], ["OH", "Columbus"], ["TX", "El Paso"],
  ["CO", "Aurora"], ["MA", "Boston"], ["CA", "San Diego"], ["TX", "Fort Worth"], ["CA", "Fresno"],
  ["FL", "Jacksonville"], ["OR", "Portland"], ["MD", "Baltimore"], ["CA", "San Francisco"], ["AZ", "Mesa"],
  ["OH", "Cleveland"], ["TN", "Nashville"], ["CT", "Hartford"], ["MI", "Detroit"], ["VA", "Richmond"],
  ["NY", "New York"], ["MO", "Kansas City"], ["CA", "Oakland"], ["TX", "Arlington"], ["WA", "Seattle"],
  ["FL", "Orlando"], ["TN", "Memphis"], ["FL", "Tampa"], ["PA", "Pittsburgh"], ["IN", "Indianapolis"],
  ["CO", "Colorado Springs"], ["NC", "Raleigh"], ["FL", "Fort Lauderdale"], ["MN", "Minneapolis"], ["AZ", "Tempe"],
  ["LA", "New Orleans"], ["AZ", "Scottsdale"], ["RI", "Providence"],
];

export function citySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const CITY_PAGES: CityPage[] = CITIES.map(([state, name]) => ({ name, state, slug: citySlug(name) }));

export function getCityPage(state: string, slug: string): CityPage | undefined {
  return CITY_PAGES.find((c) => c.state === state.toUpperCase() && c.slug === slug.toLowerCase());
}

export function cityPagePath(city: string | null | undefined, state: string | null | undefined): string | null {
  if (!city || !state) return null;
  const page = getCityPage(state, citySlug(city));
  return page ? `/accidents/${page.state.toLowerCase()}/${page.slug}` : null;
}
