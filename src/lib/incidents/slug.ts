import { slugify } from "transliteration";

/**
 * Builds a URL-friendly slug for an incident.
 *
 * The slug format is: `{location}-{short-headline}-{date}`
 * Example: `denver-co-multi-vehicle-crash-closes-i-25-2025-11-26`
 *
 * @param candidate - Object containing incident details
 * @returns A URL-safe slug string
 */
export function buildIncidentSlug(candidate: {
  city?: string;
  state?: string;
  occurredAt: Date;
  headline: string;
}): string {
  // Get the date part
  const datePart = candidate.occurredAt.toISOString().slice(0, 10); // YYYY-MM-DD

  // Build location string
  const locationParts = [candidate.city, candidate.state].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(" ") : "us";

  // Take first 6-8 words of headline for the slug
  const shortHeadline = candidate.headline
    .split(/\s+/)
    .slice(0, 8)
    .join(" ");

  // Combine and slugify
  const raw = `${location} ${shortHeadline} ${datePart}`;

  // Use transliteration library for proper slugification
  let slug = slugify(raw, {
    lowercase: true,
    separator: "-",
    trim: true,
  });

  // Clean up any double dashes
  slug = slug.replace(/-+/g, "-");

  // Ensure slug isn't too long (max 100 chars)
  if (slug.length > 100) {
    slug = slug.slice(0, 100).replace(/-$/, "");
  }

  return slug;
}

/**
 * Ensures a slug is unique by appending a counter if necessary.
 *
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Set of existing slugs to check against
 * @returns A unique slug
 */
export function ensureUniqueSlug(
  baseSlug: string,
  existingSlugs: Set<string>
): string {
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.has(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}
