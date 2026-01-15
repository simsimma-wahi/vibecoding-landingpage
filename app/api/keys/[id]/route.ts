import { NextRequest, NextResponse } from "next/server";
import { getKeyById, updateKey, deleteKey, getAllKeys } from "../storage";
import { validateApiKeyId, validateApiKeyName, validateApiKeyType } from "@/lib/utils/validation";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/lib/constants";

/**
 * GET - Fetch a single API key by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const key = await getKeyById(decodedId);

    if (!key) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.API_KEY_NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(key);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.FAILED_TO_FETCH },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT - Update an API key
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const decodedId = decodeURIComponent(resolvedParams.id);
    const id = validateApiKeyId(decodedId);

    const body = await request.json();
    const { name, type } = body;

    const validatedName = validateApiKeyName(name);
    const validatedType = type ? validateApiKeyType(type) : undefined;

    const updates: { name: string; type?: "dev" | "prod" } = {
      name: validatedName,
    };
    
    if (validatedType) {
      updates.type = validatedType;
    }

    const success = await updateKey(id, updates);

    if (!success) {
      const existingKey = await getKeyById(id);
      if (!existingKey) {
        const allKeys = await getAllKeys();
        return NextResponse.json(
          {
            error: ERROR_MESSAGES.API_KEY_NOT_FOUND,
            debug: {
              requestedId: id,
              availableIds: allKeys.map((k) => k.id),
            },
          },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }
      return NextResponse.json(
        { error: "Update failed - no rows updated" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    const updatedKey = await getKeyById(id);
    if (!updatedKey) {
      return NextResponse.json(
        { error: "Update succeeded but key not found" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(updatedKey);
  } catch (error: any) {
    console.error("Error in PUT handler:", error);
    
    const errorMessage = error?.message || ERROR_MESSAGES.FAILED_TO_UPDATE;
    const statusCode = errorMessage.includes("not found")
      ? HTTP_STATUS.NOT_FOUND
      : errorMessage.includes("RLS") || errorMessage.includes("policy")
      ? HTTP_STATUS.FORBIDDEN
      : errorMessage.includes("foreign key")
      ? HTTP_STATUS.BAD_REQUEST
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

/**
 * DELETE - Delete an API key
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const decodedId = decodeURIComponent(resolvedParams.id);
    const id = validateApiKeyId(decodedId);

    const success = await deleteKey(id);

    if (!success) {
      const allKeys = await getAllKeys();
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.API_KEY_NOT_FOUND,
          debug: {
            requestedId: id,
            availableIds: allKeys.map((k) => k.id),
            keyCount: allKeys.length,
          },
        },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.FAILED_TO_DELETE },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
