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
  "## What to Do If You Were Involved in This Crash",
  "## How to Get the Official Crash Report",
  "## Legal Disclaimer and Sources",
];

// Sections the writer includes only when the sources support them
const OPTIONAL_HEADINGS = [
  "## People Involved and Injuries",
  "## Investigation and Possible Contributing Factors",
  "## Traffic Impact",
];

// The site offers no reports, lookups, legal help or contact, and articles carry no contact details (errors if present)
const DISALLOWED_CONTENT: { pattern: RegExp; label: string }[] = [
  { pattern: /accidentfacts/i, label: "old site name AccidentFacts" },
  { pattern: /contact us|lookup service|our (free )?service|we can help/i, label: "claims the site offers a service or contact" },
  { pattern: /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/, label: "phone number" },
  { pattern: /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, label: "email address" },
  { pattern: /https?:\/\/|www\./i, label: "web address" },
  { pattern: /\]\((?!\/crash-reports\/[a-z-]+\))[^)]*\)/, label: "link other than a state crash report guide" },
  { pattern: /\b[A-Z][a-z]+ (Law Firm|Law Group|Law Offices?)\b|\b(LLP|PLLC|Attorneys at Law)\b|& Associates\b/, label: "law firm name" },
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
 * - Minimum article length (800 chars), and at most `maxWords` words when given
 * - Each section must have some content
 *
 * Content checks (errors if fail):
 * - No disallowed phrases (legal liability)
 * - No service claims, contact details, outside links or law firm names
 *
 * Content checks (warnings only):
 * - Sensationalist language flagged for review
 *
 * @param markdown - The article markdown content
 * @param options.maxWords - Word cap scaled to the source material, so thin stories aren't padded
 * @returns Validation result with ok, errors, and warnings arrays
 */
export function validateIncidentArticle(
  markdown: string,
  options: { maxWords?: number } = {}
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

  const words = markdown.split(/\s+/).filter(Boolean).length;
  if (options.maxWords && words > options.maxWords) {
    errors.push(`Article too long for its sources: ${words} words (maximum: ${options.maxWords})`);
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
  for (const heading of [...REQUIRED_HEADINGS, ...OPTIONAL_HEADINGS]) {
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

  const foundContent = DISALLOWED_CONTENT.filter(({ pattern }) => pattern.test(markdown)).map(({ label }) => label);
  if (foundContent.length > 0) {
    errors.push(`Contains disallowed content: ${foundContent.join(", ")}`);
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

function wordsOf(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
}

/**
 * Returns the first run of `runLength` consecutive words the article shares with any source, or null.
 * Case and punctuation are ignored, so Markdown formatting doesn't hide a copied passage.
 */
export function findCopiedRun(markdown: string, sources: string[], runLength = 12): string | null {
  const seen = new Set<string>();
  for (const source of sources) {
    const words = wordsOf(source);
    for (let i = 0; i + runLength <= words.length; i++) seen.add(words.slice(i, i + runLength).join(" "));
  }
  if (seen.size === 0) return null;
  const words = wordsOf(markdown);
  for (let i = 0; i + runLength <= words.length; i++) {
    const run = words.slice(i, i + runLength).join(" ");
    if (seen.has(run)) return run;
  }
  return null;
}

/** Every passage of `runLength` or more consecutive words the article shares with the sources, overlaps merged. */
export function findCopiedRuns(markdown: string, sources: string[], runLength = 12): string[] {
  const seen = new Set<string>();
  for (const source of sources) {
    const words = wordsOf(source);
    for (let i = 0; i + runLength <= words.length; i++) seen.add(words.slice(i, i + runLength).join(" "));
  }
  const words = wordsOf(markdown);
  const runs: string[] = [];
  let from = 0;
  let to = -1;
  for (let i = 0; i + runLength <= words.length; i++) {
    if (!seen.has(words.slice(i, i + runLength).join(" "))) continue;
    if (i > to) {
      if (to >= 0) runs.push(words.slice(from, to).join(" "));
      from = i;
    }
    to = i + runLength;
  }
  if (to >= 0) runs.push(words.slice(from, to).join(" "));
  return runs;
}

/**
 * Quick validation check - just returns true/false.
 * Useful for simple pass/fail checks without full error details.
 */
export function isValidArticle(markdown: string): boolean {
  return validateIncidentArticle(markdown).ok;
}
