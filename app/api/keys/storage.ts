import { createServerClient } from "../../../lib/supabase-server";
import type { ApiKey } from "@/lib/types";

const PLACEHOLDER_USER_ID = "00000000-0000-0000-0000-000000000000";
const SUPABASE_ERROR_CODES = {
  NO_ROWS: "PGRST116",
  RLS_POLICY: "42501",
  FOREIGN_KEY: "23503",
} as const;

/**
 * Converts Supabase row to ApiKey interface
 */
function rowToApiKey(row: any): ApiKey {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    key: row.key,
    usage: row.usage || 0,
    createdAt: row.created_at || row.createdAt,
  };
}

/**
 * Gets the authenticated user ID or returns a placeholder for development
 */
async function getUserId(supabase: any): Promise<string> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn(
      "No authenticated user found. Using placeholder user_id for development."
    );
    return PLACEHOLDER_USER_ID;
  }

  return user.id;
}

/**
 * Get all API keys for the authenticated user
 */
export async function getAllKeys(): Promise<ApiKey[]> {
  try {
    const serverSupabase = await createServerClient();

    const { data, error } = await serverSupabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all keys:", error);
      throw error;
    }

    return (data || []).map(rowToApiKey);
  } catch (error) {
    console.error("Error in getAllKeys:", error);
    throw error;
  }
}

/**
 * Get a single API key by ID (only for authenticated user)
 */
export async function getKeyById(id: string): Promise<ApiKey | undefined> {
  try {
    const serverSupabase = await createServerClient();

    const { data, error } = await serverSupabase
      .from("api_keys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === SUPABASE_ERROR_CODES.NO_ROWS) {
        return undefined;
      }
      console.error("Error fetching key by ID:", error);
      throw error;
    }

    return data ? rowToApiKey(data) : undefined;
  } catch (error) {
    console.error("Error in getKeyById:", error);
    return undefined;
  }
}

/**
 * Create a new API key (for authenticated user)
 */
export async function createKey(key: ApiKey): Promise<void> {
  try {
    const serverSupabase = await createServerClient();
    const userId = await getUserId(serverSupabase);

    const { error } = await serverSupabase.from("api_keys").insert({
      id: key.id,
      user_id: userId,
      name: key.name,
      type: key.type,
      key: key.key,
      usage: key.usage || 0,
      created_at: key.createdAt || new Date().toISOString(),
    });

    if (error) {
      handleSupabaseError(error);
    }
  } catch (error: any) {
    console.error("Error in createKey:", error);
    if (error.message) {
      throw error;
    }
    throw new Error(`Failed to create API key: ${error.message || "Unknown error"}`);
  }
}

/**
 * Update an API key (only for authenticated user)
 */
export async function updateKey(
  id: string,
  updates: Partial<ApiKey>
): Promise<boolean> {
  try {
    const serverSupabase = await createServerClient();

    const updateData: any = {};

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    if (updates.type !== undefined) {
      updateData.type = updates.type;
    }
    if (updates.usage !== undefined) {
      updateData.usage = updates.usage;
    }
    if (updates.key !== undefined) {
      updateData.key = updates.key;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields provided to update");
    }

    // Check if the key exists
    const { data: existingKey, error: checkError } = await serverSupabase
      .from("api_keys")
      .select("id, name, user_id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === SUPABASE_ERROR_CODES.NO_ROWS) {
        throw new Error(`API key with ID "${id}" not found in database`);
      }
      console.error("Error checking for existing key:", checkError);
      throw checkError;
    }

    if (!existingKey) {
      throw new Error(`API key with ID "${id}" not found in database`);
    }

    // Perform the update
    const { error: updateError } = await serverSupabase
      .from("api_keys")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      handleSupabaseError(updateError);
    }

    // Verify the update by fetching the updated key
    const { data: updatedData, error: fetchError } = await serverSupabase
      .from("api_keys")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.warn("Update executed but could not fetch updated key");
      return true; // Assume success if update didn't error
    }

    return !!updatedData;
  } catch (error: any) {
    console.error("Error in updateKey:", error);
    if (error.message) {
      throw error;
    }
    throw new Error(`Failed to update API key: ${error.message || "Unknown error"}`);
  }
}

/**
 * Delete an API key (only for authenticated user)
 */
export async function deleteKey(id: string): Promise<boolean> {
  try {
    const serverSupabase = await createServerClient();
    const normalizedId = String(id).trim();

    const { data, error } = await serverSupabase
      .from("api_keys")
      .delete()
      .eq("id", normalizedId)
      .select();

    if (error) {
      console.error("Error deleting key:", error);
      throw error;
    }

    return !!(data && data.length > 0);
  } catch (error) {
    console.error("Error in deleteKey:", error);
    return false;
  }
}

/**
 * Handles Supabase-specific errors and throws user-friendly messages
 */
function handleSupabaseError(error: any): never {
  if (error.code === SUPABASE_ERROR_CODES.RLS_POLICY || error.message?.includes("policy")) {
    throw new Error(
      "Row Level Security is enabled. Please authenticate or disable RLS for development."
    );
  }

  if (
    error.code === SUPABASE_ERROR_CODES.FOREIGN_KEY ||
    error.message?.includes("foreign key") ||
    error.message?.includes("user_id")
  ) {
    throw new Error(
      "Foreign key constraint violation. The user_id must exist in auth.users. For development, remove the foreign key constraint or create a test user."
    );
  }

  console.error("Supabase error:", {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  throw error;
}
