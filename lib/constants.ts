export const TOAST_DURATION = 3000;
export const API_KEY_PREFIX = "tvly";
export const API_KEY_RANDOM_LENGTH = 32;
export const API_KEY_MASK_LENGTH = 32;

export const API_ENDPOINTS = {
  KEYS: "/api/keys",
  KEY_BY_ID: (id: string) => `/api/keys/${encodeURIComponent(id)}`,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_NAME: "Name is required",
  INVALID_API_KEY_ID: "Invalid API key ID",
  API_KEY_NOT_FOUND: "API key not found",
  FAILED_TO_FETCH: "Failed to fetch API keys",
  FAILED_TO_CREATE: "Failed to create API key",
  FAILED_TO_UPDATE: "Failed to update API key",
  FAILED_TO_DELETE: "Failed to delete API key",
  COPY_FAILED: "Failed to copy to clipboard. Please copy manually.",
  COPY_SUCCESS: "API key copied to clipboard!",
  API_KEY_REQUIRED: "API key is required",
  INVALID_API_KEY: "Invalid API key",
} as const;
