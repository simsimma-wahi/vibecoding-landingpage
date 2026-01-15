"use client";

import type { ApiKeyFormData } from "@/lib/types";

interface ApiKeyModalProps {
  title: string;
  formData: ApiKeyFormData;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (data: ApiKeyFormData) => void;
  submitting: boolean;
  submitLabel?: string;
  darkMode?: boolean;
}

export function ApiKeyModal({
  title,
  formData,
  onSubmit,
  onCancel,
  onChange,
  submitting,
  submitLabel = "Submit",
  darkMode = false,
}: ApiKeyModalProps) {
  const baseStyles = darkMode
    ? "bg-zinc-800 dark:bg-zinc-900 border border-zinc-700"
    : "bg-white dark:bg-zinc-900";
  const textStyles = darkMode
    ? "text-white"
    : "text-black dark:text-zinc-50";
  const inputStyles = darkMode
    ? "border-zinc-600 bg-zinc-700 text-white placeholder-zinc-400"
    : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-zinc-50";
  const labelStyles = darkMode
    ? "text-white"
    : "text-zinc-700 dark:text-zinc-300";
  const buttonStyles = darkMode
    ? "border-zinc-600 text-white hover:bg-zinc-700"
    : "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800";
  const submitButtonStyles = darkMode
    ? "bg-white text-black hover:bg-zinc-200"
    : "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onCancel();
        }
      }}
    >
      <div
        className={`${baseStyles} rounded-lg max-w-md w-full p-6 shadow-xl ${darkMode ? "border border-zinc-700 relative z-10" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className={`text-xl font-semibold mb-4 ${textStyles}`}>{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className={`block text-sm font-medium ${labelStyles} mb-2`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              placeholder={darkMode ? "Enter API key name" : "e.g., default"}
              className={`w-full px-3 py-2 border rounded-lg ${inputStyles} focus:outline-none focus:ring-2 ${darkMode ? "focus:ring-white" : "focus:ring-black dark:focus:ring-white"}`}
              required
              disabled={submitting}
              autoFocus={darkMode}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="type"
              className={`block text-sm font-medium ${labelStyles} mb-2`}
            >
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                onChange({ ...formData, type: e.target.value as "dev" | "prod" })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputStyles} focus:outline-none focus:ring-2 ${darkMode ? "focus:ring-white appearance-none cursor-pointer" : "focus:ring-black dark:focus:ring-white"}`}
              disabled={submitting}
            >
              <option value="dev" className={darkMode ? "bg-zinc-700" : ""}>
                dev
              </option>
              <option value="prod" className={darkMode ? "bg-zinc-700" : ""}>
                prod
              </option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className={`px-4 py-2 border rounded-lg ${buttonStyles} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 ${submitButtonStyles} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium`}
            >
              {submitting ? "Processing..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
