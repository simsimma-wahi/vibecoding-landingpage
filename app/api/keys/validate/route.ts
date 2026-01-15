import { NextRequest, NextResponse } from "next/server";
import { getAllKeys } from "../storage";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

/**
 * POST - Validate an API key
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: "API key is required" },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const keys = await getAllKeys();
    const isValid = keys.some((key) => key.key === apiKey.trim());

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("Error validating API key:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate API key" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
