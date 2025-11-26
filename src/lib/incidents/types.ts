/**
 * Type definitions for the incident ingestion system.
 */

/**
 * A source article attached to an incident.
 */
export interface IncidentSource {
  sourceType: "google_news";
  url: string;
  title: string;
  publisher?: string;
  publishedAt: Date;
  rawSnippet?: string;
}

/**
 * An incident candidate before being saved to the database.
 * Used during the normalization process.
 */
export interface IncidentCandidate {
  headline: string;
  link: string;
  publisher?: string;
  occurredAt: Date;
  snippet?: string;
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Full incident as stored in the database.
 */
export interface Incident {
  id: string;
  slug: string;
  headline: string;
  summary?: string;
  city?: string;
  state?: string;
  country?: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  dedupeKey: string;
  sources: IncidentSource[];
}
