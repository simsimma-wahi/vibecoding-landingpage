import { ERROR_MESSAGES } from "../constants";

/**
 * Validates API key name
 */
export function validateApiKeyName(name: unknown): string {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new Error(ERROR_MESSAGES.REQUIRED_NAME);
  }
  return name.trim();
}

/**
 * Validates API key type
 */
export function validateApiKeyType(
  type: unknown
): "dev" | "prod" {
  if (type === "prod") return "prod";
  return "dev";
}

/**
 * Validates API key ID
 */
export function validateApiKeyId(id: unknown): string {
  if (!id || typeof id !== "string" || id.trim().length === 0 || id === "undefined") {
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY_ID);
  }
  return id.trim();
}
