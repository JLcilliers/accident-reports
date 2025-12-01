/**
 * Central article validator for 12-section AI-generated articles.
 *
 * Validates structure and content quality to ensure articles meet
 * editorial and legal standards before publication.
 */

// Minimum article length (characters)
const MIN_ARTICLE_LENGTH = 800;

// Required section headings (must all be present)
export const REQUIRED_HEADINGS = [
  "## Key Facts",
  "## What We Know About the Crash",
  "## People Involved and Injuries",
  "## Investigation and Possible Contributing Factors",
  "## Traffic Impact",
  "## What to Do If You Were Involved in This Crash",
  "## How to Get the Official Crash Report",
  "## Legal Disclaimer and Sources",
];

// Phrases that could create legal liability (errors if present)
const DISALLOWED_PHRASES = [
  "guaranteed compensation",
  "you will win your case",
  "we guarantee you will",
  "guaranteed results",
  "guaranteed recovery",
  "certain to receive",
  "definitely get compensation",
  "promise you will",
];

// Strong/sensationalist language (warnings, not errors)
const SENSATIONAL_PHRASES = [
  "horrific crash",
  "brutal crash",
  "gruesome",
  "horrifying",
  "devastating tragedy",
  "nightmare scenario",
  "bloodbath",
  "carnage",
];

export type ArticleValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Check if a section has actual content under it.
 * Looks for at least some text between this heading and the next.
 */
function sectionHasContent(markdown: string, heading: string): boolean {
  const headingIndex = markdown.indexOf(heading);
  if (headingIndex === -1) return false;

  // Find the next heading or end of content
  const afterHeading = markdown.slice(headingIndex + heading.length);
  const nextHeadingMatch = afterHeading.match(/\n##\s/);
  const sectionContent = nextHeadingMatch
    ? afterHeading.slice(0, nextHeadingMatch.index)
    : afterHeading;

  // Remove whitespace and check if there's meaningful content
  const trimmed = sectionContent.trim();
  // Should have at least 20 chars of actual content (not just whitespace/newlines)
  return trimmed.length >= 20;
}

/**
 * Validate an AI-generated incident article.
 *
 * Structure checks (errors if fail):
 * - All required section headings must be present
 * - Minimum article length (800 chars)
 * - Each section must have some content
 *
 * Content checks (errors if fail):
 * - No disallowed phrases (legal liability)
 *
 * Content checks (warnings only):
 * - Sensationalist language flagged for review
 *
 * @param markdown - The article markdown content
 * @returns Validation result with ok, errors, and warnings arrays
 */
export function validateIncidentArticle(
  markdown: string
): ArticleValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // === Structure Checks ===

  // Check minimum length
  if (markdown.length < MIN_ARTICLE_LENGTH) {
    errors.push(
      `Article too short: ${markdown.length} chars (minimum: ${MIN_ARTICLE_LENGTH})`
    );
  }

  // Check required headings
  const missingHeadings: string[] = [];
  for (const heading of REQUIRED_HEADINGS) {
    if (!markdown.includes(heading)) {
      missingHeadings.push(heading);
    }
  }
  if (missingHeadings.length > 0) {
    errors.push(`Missing required headings: ${missingHeadings.join(", ")}`);
  }

  // Check that each present section has content
  const emptySections: string[] = [];
  for (const heading of REQUIRED_HEADINGS) {
    if (markdown.includes(heading) && !sectionHasContent(markdown, heading)) {
      emptySections.push(heading);
    }
  }
  if (emptySections.length > 0) {
    errors.push(`Empty sections (no content): ${emptySections.join(", ")}`);
  }

  // === Content Checks (Errors) ===

  // Check for disallowed legal phrases
  const lowerMarkdown = markdown.toLowerCase();
  const foundDisallowed: string[] = [];
  for (const phrase of DISALLOWED_PHRASES) {
    if (lowerMarkdown.includes(phrase.toLowerCase())) {
      foundDisallowed.push(phrase);
    }
  }
  if (foundDisallowed.length > 0) {
    errors.push(
      `Contains disallowed legal phrases: ${foundDisallowed.join(", ")}`
    );
  }

  // === Content Checks (Warnings) ===

  // Check for sensationalist language
  const foundSensational: string[] = [];
  for (const phrase of SENSATIONAL_PHRASES) {
    if (lowerMarkdown.includes(phrase.toLowerCase())) {
      foundSensational.push(phrase);
    }
  }
  if (foundSensational.length > 0) {
    warnings.push(
      `Contains sensationalist language (review recommended): ${foundSensational.join(", ")}`
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Quick validation check - just returns true/false.
 * Useful for simple pass/fail checks without full error details.
 */
export function isValidArticle(markdown: string): boolean {
  return validateIncidentArticle(markdown).ok;
}
