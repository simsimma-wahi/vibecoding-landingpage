import type { Toast as ToastType } from "@/lib/types";

interface ToastProps {
  toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] ${getToastStyles()}`}
    >
      <span>{getIcon()}</span>
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
