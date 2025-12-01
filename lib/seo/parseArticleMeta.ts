/**
 * Utility to parse SEO meta block from AI-generated article content.
 *
 * The articleBody may contain a JSON block at the beginning:
 * ```json
 * { "seo_title": "...", "meta_description": "...", "primary_keyword": "...", "secondary_keywords": [...] }
 * ```
 *
 * This parser extracts that data for use in page metadata.
 */

export interface ArticleMeta {
  seoTitle: string | null;
  metaDescription: string | null;
  primaryKeyword: string | null;
  secondaryKeywords: string[];
}

/**
 * Parse SEO meta from an articleBody string.
 *
 * Returns extracted meta values or nulls if the JSON block is missing/invalid.
 * The JSON block is expected to be at the start of the article wrapped in ```json ... ```
 */
export function parseArticleMeta(articleBody: string | null | undefined): ArticleMeta {
  const defaults: ArticleMeta = {
    seoTitle: null,
    metaDescription: null,
    primaryKeyword: null,
    secondaryKeywords: [],
  };

  if (!articleBody) {
    return defaults;
  }

  // Match JSON block at the beginning of the article
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = articleBody.match(jsonBlockRegex);

  if (!match) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(match[1]) as {
      seo_title?: string;
      meta_description?: string;
      primary_keyword?: string;
      secondary_keywords?: string[];
    };

    return {
      seoTitle: parsed.seo_title?.trim() || null,
      metaDescription: parsed.meta_description?.trim() || null,
      primaryKeyword: parsed.primary_keyword?.trim() || null,
      secondaryKeywords: Array.isArray(parsed.secondary_keywords)
        ? parsed.secondary_keywords.filter(Boolean)
        : [],
    };
  } catch {
    // JSON parsing failed - return defaults
    return defaults;
  }
}

/**
 * Build keywords string from primary and secondary keywords.
 * Useful for <meta name="keywords"> tag.
 */
export function buildKeywordsString(meta: ArticleMeta): string | null {
  const keywords: string[] = [];

  if (meta.primaryKeyword) {
    keywords.push(meta.primaryKeyword);
  }

  if (meta.secondaryKeywords.length > 0) {
    keywords.push(...meta.secondaryKeywords);
  }

  return keywords.length > 0 ? keywords.join(", ") : null;
}
