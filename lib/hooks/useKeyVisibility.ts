import { useState, useCallback } from "react";

/**
 * Custom hook for managing API key visibility state
 */
export function useKeyVisibility() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = useCallback((id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const showKey = useCallback((id: string) => {
    setVisibleKeys((prev) => new Set(prev).add(id));
  }, []);

  return {
    visibleKeys,
    toggleKeyVisibility,
    showKey,
  };
}
