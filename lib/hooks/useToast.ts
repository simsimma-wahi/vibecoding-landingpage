import { useState, useCallback } from "react";
import { TOAST_DURATION } from "../constants";
import type { Toast, ToastType } from "../types";

/**
 * Custom hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION);
    },
    []
  );

  return { toasts, showToast };
}
