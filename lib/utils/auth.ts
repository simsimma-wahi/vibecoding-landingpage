import { getAllKeys } from "@/app/api/keys/storage";

/**
 * Validates an API key and returns true if valid
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return false;
    }

    const keys = await getAllKeys();
    return keys.some((key) => key.key === apiKey.trim());
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }
}

/**
 * Extracts API key from request headers or body
 */
export function extractApiKey(request: Request, body?: any): string | null {
  // Try Authorization header first (Bearer token format)
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch) {
      return bearerMatch[1];
    }
    // Also support just the key in Authorization header
    if (authHeader.trim()) {
      return authHeader.trim();
    }
  }

  // Try X-API-Key or x-api-key header (case-insensitive)
  // Check all possible header name variations
  const headerNames = ["X-API-Key", "x-api-key", "X-Api-Key", "x-Api-Key"];
  for (const headerName of headerNames) {
    const apiKeyHeader = request.headers.get(headerName);
    if (apiKeyHeader) {
      return apiKeyHeader.trim();
    }
  }

  // Try body
  if (body?.apiKey) {
    return body.apiKey;
  }

  return null;
}
