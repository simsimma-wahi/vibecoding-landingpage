"use client";

interface DeleteConfirmModalProps {
  keyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export function DeleteConfirmModal({
  keyName,
  onConfirm,
  onCancel,
  deleting,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) {
          onCancel();
        }
      }}
    >
      <div
        className="bg-zinc-800 dark:bg-zinc-900 rounded-lg max-w-md w-full p-6 shadow-xl border border-zinc-700 dark:border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Delete API Key</h2>
        <p className="text-sm text-zinc-400 mb-2">
          Are you sure you want to delete the API key{" "}
          <span className="font-semibold text-white">"{keyName}"</span>?
        </p>
        <p className="text-sm text-zinc-400 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 border border-zinc-600 rounded-lg text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
