"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/app/components/ToastContainer";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toasts, showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showToast("Please enter an API key", "error");
      return;
    }

    setSubmitting(true);
    
    try {
      // Store the API key in sessionStorage to pass to protected page
      sessionStorage.setItem("apiKey", apiKey.trim());
      
      // Navigate to protected page
      router.push("/protected");
    } catch (error) {
      console.error("Error navigating to protected page:", error);
      showToast("Failed to navigate to protected page", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative">
      <ToastContainer toasts={toasts} />

      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
            API Playground
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Enter your API key to access the protected area
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono text-sm"
                required
                disabled={submitting}
                autoFocus
              />
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Your API key will be validated when you access the protected area
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !apiKey.trim()}
              className="w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Submitting..." : "Submit & Access Protected Area"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
