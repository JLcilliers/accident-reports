/**
 * Google Indexing API Integration
 *
 * Submits URLs to Google Search Console for faster indexing.
 * Requires a Google Cloud service account with Indexing API enabled.
 *
 * Setup:
 * 1. Create a Google Cloud project
 * 2. Enable the Indexing API
 * 3. Create a service account and download the JSON key
 * 4. Add the service account email as an owner in Google Search Console
 * 5. Set GOOGLE_INDEXING_CREDENTIALS env var with the JSON key contents
 */

const INDEXING_API_URL =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface IndexingResult {
  success: boolean;
  url: string;
  error?: string;
  response?: {
    urlNotificationMetadata?: {
      url: string;
      latestUpdate?: {
        type: string;
        notifyTime: string;
      };
    };
  };
}

/**
 * Creates a JWT for Google API authentication
 */
async function createJWT(
  credentials: ServiceAccountCredentials
): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: credentials.token_uri,
    iat: now,
    exp: now + 3600, // 1 hour
  };

  const encoder = new TextEncoder();

  // Base64URL encode header and claim
  const base64Header = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const base64Claim = btoa(JSON.stringify(claim))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const signatureInput = `${base64Header}.${base64Claim}`;

  // Import private key and sign
  const privateKey = credentials.private_key.replace(/\\n/g, "\n");

  // Convert PEM to ArrayBuffer
  const pemContents = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${signatureInput}.${base64Signature}`;
}

/**
 * Gets an access token using service account credentials
 */
async function getAccessToken(
  credentials: ServiceAccountCredentials
): Promise<string> {
  const jwt = await createJWT(credentials);

  const response = await fetch(credentials.token_uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Parses the service account credentials from environment variable
 */
function getCredentials(): ServiceAccountCredentials | null {
  const credentialsJson = process.env.GOOGLE_INDEXING_CREDENTIALS;

  if (!credentialsJson) {
    console.log("[Indexing] GOOGLE_INDEXING_CREDENTIALS not configured");
    return null;
  }

  try {
    return JSON.parse(credentialsJson);
  } catch {
    console.error("[Indexing] Failed to parse GOOGLE_INDEXING_CREDENTIALS");
    return null;
  }
}

/**
 * Submits a URL to Google for indexing
 *
 * @param url - The full URL to submit for indexing
 * @param type - "URL_UPDATED" for new/updated content, "URL_DELETED" for removed content
 */
export async function submitUrlForIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingResult> {
  const credentials = getCredentials();

  if (!credentials) {
    return {
      success: false,
      url,
      error: "Google Indexing API credentials not configured",
    };
  }

  try {
    const accessToken = await getAccessToken(credentials);

    const response = await fetch(INDEXING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Indexing] Failed to submit ${url}:`, errorText);
      return {
        success: false,
        url,
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    console.log(`[Indexing] Successfully submitted ${url} for indexing`);

    return {
      success: true,
      url,
      response: data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Indexing] Error submitting ${url}:`, message);
    return {
      success: false,
      url,
      error: message,
    };
  }
}

/**
 * Submits multiple URLs for indexing in batch
 *
 * @param urls - Array of URLs to submit
 * @param type - "URL_UPDATED" or "URL_DELETED"
 */
export async function submitUrlsForIndexing(
  urls: string[],
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingResult[]> {
  const results: IndexingResult[] = [];

  // Google Indexing API has a rate limit of 200 requests per day
  // Process sequentially with a small delay to avoid rate limiting
  for (const url of urls) {
    const result = await submitUrlForIndexing(url, type);
    results.push(result);

    // Small delay between requests (100ms)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Builds the full URL for an incident
 */
export function buildIncidentUrl(slug: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carcrashreport.com";
  return `${baseUrl}/incidents/${slug}`;
}
