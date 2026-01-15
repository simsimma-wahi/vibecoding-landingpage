import { useState, useEffect, useCallback } from "react";
import { fetchApiKeys, createApiKey, updateApiKey, deleteApiKey } from "../utils/api-keys";
import type { ApiKey, ApiKeyFormData } from "../types";
import type { ToastType } from "../types";

interface UseApiKeysOptions {
  showToast: (message: string, type: ToastType) => void;
}

/**
 * Custom hook for managing API keys state and operations
 */
export function useApiKeys({ showToast }: UseApiKeysOptions) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadApiKeys = useCallback(async () => {
    try {
      const keys = await fetchApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      showToast("Failed to load API keys", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  const handleCreate = useCallback(
    async (formData: ApiKeyFormData) => {
      setSubmitting(true);
      try {
        const newKey = await createApiKey(formData);
        showToast(`API key "${formData.name}" created successfully!`, "success");
        await loadApiKeys();
        return newKey;
      } catch (error: any) {
        showToast(error.message || "Failed to create API key", "error");
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [loadApiKeys, showToast]
  );

  const handleUpdate = useCallback(
    async (id: string, formData: ApiKeyFormData) => {
      setSubmitting(true);
      try {
        const updatedKey = await updateApiKey(id, formData);
        showToast(`API key "${updatedKey.name}" updated successfully!`, "success");
        await loadApiKeys();
        return updatedKey;
      } catch (error: any) {
        showToast(error.message || "Failed to update API key", "error");
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [loadApiKeys, showToast]
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      setDeleting(true);
      try {
        await deleteApiKey(id);
        showToast(`API key "${name}" deleted successfully`, "success");
        await loadApiKeys();
      } catch (error: any) {
        showToast(error.message || "Failed to delete API key", "error");
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    [loadApiKeys, showToast]
  );

  return {
    apiKeys,
    loading,
    submitting,
    deleting,
    handleCreate,
    handleUpdate,
    handleDelete,
    refreshKeys: loadApiKeys,
  };
}
