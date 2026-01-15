"use client";

import { useState } from "react";
import { useToast } from "@/lib/hooks/useToast";
import { useApiKeys } from "@/lib/hooks/useApiKeys";
import { useKeyVisibility } from "@/lib/hooks/useKeyVisibility";
import { ToastContainer } from "@/app/components/ToastContainer";
import { PlanCard } from "@/app/components/PlanCard";
import { ApiKeyTable } from "@/app/components/ApiKeyTable";
import { ApiKeyModal } from "@/app/components/ApiKeyModal";
import { DeleteConfirmModal } from "@/app/components/DeleteConfirmModal";
import type { ApiKey, ApiKeyFormData } from "@/lib/types";

const INITIAL_FORM_DATA: ApiKeyFormData = { name: "", type: "dev" };

export default function DashboardsPage() {
  const { toasts, showToast } = useToast();
  const {
    apiKeys,
    loading,
    submitting,
    deleting,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useApiKeys({ showToast });
  const { visibleKeys, toggleKeyVisibility, showKey } = useKeyVisibility();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState<ApiKeyFormData>(INITIAL_FORM_DATA);
  const [payAsYouGo, setPayAsYouGo] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newKey = await handleCreate(formData);
      setShowCreateModal(false);
      resetForm();
      if (newKey) {
        showKey(newKey.id);
      }
    } catch (error) {
      // Error already handled by useApiKeys hook
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editingKey || submitting) return;

    try {
      await handleUpdate(editingKey.id, formData);
      setEditingKey(null);
      resetForm();
    } catch (error) {
      // Error already handled by useApiKeys hook
    }
  };

  const handleDeleteConfirm = async () => {
    if (!keyToDelete || deleting) return;
    
    try {
      await handleDelete(keyToDelete.id, keyToDelete.name);
      setKeyToDelete(null);
    } catch (error) {
      // Error already handled by useApiKeys hook
    }
  };

  const startEdit = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({ name: key.name || "", type: key.type || "dev" });
  };

  const confirmDelete = (key: ApiKey) => {
    setKeyToDelete(key);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative">
      <ToastContainer toasts={toasts} />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PlanCard
          payAsYouGo={payAsYouGo}
          onTogglePayAsYouGo={() => setPayAsYouGo(!payAsYouGo)}
        />

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                API Keys
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
              <p className="mb-4">No API keys yet. Create your first one!</p>
            </div>
          ) : (
            <ApiKeyTable
              apiKeys={apiKeys}
              visibleKeys={visibleKeys}
              onToggleVisibility={toggleKeyVisibility}
              onEdit={startEdit}
              onDelete={confirmDelete}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {showCreateModal && (
        <ApiKeyModal
          title="Create API Key"
          formData={formData}
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          onChange={setFormData}
          submitting={submitting}
          submitLabel="Create"
        />
      )}

      {editingKey && (
        <ApiKeyModal
          title="Edit API Key"
          formData={formData}
          onSubmit={handleUpdateSubmit}
          onCancel={() => {
            if (!submitting) {
              setEditingKey(null);
              resetForm();
            }
          }}
          onChange={setFormData}
          submitting={submitting}
          submitLabel="Update"
          darkMode={true}
        />
      )}

      {keyToDelete && (
        <DeleteConfirmModal
          keyName={keyToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!deleting) {
              setKeyToDelete(null);
            }
          }}
          deleting={deleting}
        />
      )}
    </div>
  );
}
