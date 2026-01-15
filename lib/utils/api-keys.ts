import { API_ENDPOINTS, ERROR_MESSAGES, API_KEY_MASK_LENGTH } from "../constants";
import type { ApiKey, ApiKeyFormData } from "../types";

/**
 * Fetches all API keys from the server
 */
export async function fetchApiKeys(): Promise<ApiKey[]> {
  const response = await fetch(API_ENDPOINTS.KEYS);
  
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH);
  }
  
  return response.json();
}

/**
 * Creates a new API key
 */
export async function createApiKey(
  formData: ApiKeyFormData
): Promise<ApiKey> {
  const response = await fetch(API_ENDPOINTS.KEYS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || ERROR_MESSAGES.FAILED_TO_CREATE);
  }

  return response.json();
}

/**
 * Updates an existing API key
 */
export async function updateApiKey(
  id: string,
  formData: ApiKeyFormData
): Promise<ApiKey> {
  const response = await fetch(API_ENDPOINTS.KEY_BY_ID(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || ERROR_MESSAGES.FAILED_TO_UPDATE);
  }

  return response.json();
}

/**
 * Deletes an API key
 */
export async function deleteApiKey(id: string): Promise<void> {
  const response = await fetch(API_ENDPOINTS.KEY_BY_ID(id), {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || ERROR_MESSAGES.FAILED_TO_DELETE);
  }
}

/**
 * Masks an API key for display (shows only prefix)
 */
export function maskKey(key: string): string {
  const prefix = key.split("-").slice(0, 2).join("-") + "-";
  return prefix + "*".repeat(API_KEY_MASK_LENGTH);
}
