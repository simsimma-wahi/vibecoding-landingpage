import { NextRequest, NextResponse } from "next/server";
import { getAllKeys, createKey } from "./storage";
import { validateApiKeyName, validateApiKeyType } from "@/lib/utils/validation";
import { API_KEY_PREFIX, API_KEY_RANDOM_LENGTH, HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";
import type { ApiKey } from "@/lib/types";

/**
 * Generates a random API key with the specified type prefix
 */
function generateApiKey(type: "dev" | "prod"): string {
  const prefix = `${API_KEY_PREFIX}-${type}-`;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomPart = Array.from({ length: API_KEY_RANDOM_LENGTH }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
  return prefix + randomPart;
}

/**
 * GET - Fetch all API keys
 */
export async function GET() {
  try {
    const keys = await getAllKeys();
    return NextResponse.json(keys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.FAILED_TO_FETCH },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST - Create a new API key
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type } = body;

    const validatedName = validateApiKeyName(name);
    const validatedType = validateApiKeyType(type);

    const newKey: ApiKey = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: validatedName,
      type: validatedType,
      key: generateApiKey(validatedType),
      usage: 0,
      createdAt: new Date().toISOString(),
    };

    await createKey(newKey);

    return NextResponse.json(newKey, { status: HTTP_STATUS.CREATED });
  } catch (error: any) {
    console.error("Error creating API key:", error);
    
    const errorMessage = error?.message || ERROR_MESSAGES.FAILED_TO_CREATE;
    const statusCode = errorMessage.includes("authenticated")
      ? HTTP_STATUS.UNAUTHORIZED
      : errorMessage.includes("required")
      ? HTTP_STATUS.BAD_REQUEST
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
