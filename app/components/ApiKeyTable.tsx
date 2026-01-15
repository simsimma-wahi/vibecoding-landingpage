"use client";

import { maskKey } from "@/lib/utils/api-keys";
import { copyToClipboard } from "@/lib/utils/clipboard";
import type { ApiKey } from "@/lib/types";
import type { ToastType } from "@/lib/types";

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  visibleKeys: Set<string>;
  onToggleVisibility: (id: string) => void;
  onEdit: (key: ApiKey) => void;
  onDelete: (key: ApiKey) => void;
  showToast: (message: string, type: ToastType) => void;
}

export function ApiKeyTable({
  apiKeys,
  visibleKeys,
  onToggleVisibility,
  onEdit,
  onDelete,
  showToast,
}: ApiKeyTableProps) {
  const handleCopy = (key: string) => {
    copyToClipboard(key, showToast);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              NAME
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              TYPE
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              USAGE
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              KEY
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              OPTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {apiKeys.map((key) => (
            <tr
              key={key.id}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-zinc-50">
                {key.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                  {key.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                {key.usage}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <code className="text-xs font-mono text-zinc-800 dark:text-zinc-200">
                  {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                </code>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-3">
                  <VisibilityButton
                    isVisible={visibleKeys.has(key.id)}
                    onClick={() => onToggleVisibility(key.id)}
                  />
                  <CopyButton onClick={() => handleCopy(key.key)} />
                  <EditButton onClick={() => onEdit(key)} />
                  <DeleteButton onClick={() => onDelete(key)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VisibilityButton({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      title={isVisible ? "Hide key" : "Show key"}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isVisible ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </>
        )}
      </svg>
    </button>
  );
}

function CopyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      title="Copy to clipboard"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      title="Edit"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
      title="Delete"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}
