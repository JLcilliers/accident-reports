/**
 * Incident ingestion system exports.
 *
 * This module provides utilities for:
 * - Fetching accident news from Google News RSS
 * - Normalizing news items into incident candidates
 * - De-duplicating incidents
 * - Saving incidents to the database
 */

export * from "./types";
export * from "./fromGoogleNews";
export * from "./dedupe";
export * from "./slug";
export * from "./save";
