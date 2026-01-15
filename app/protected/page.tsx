"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/app/components/ToastContainer";

export default function ProtectedPage() {
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const { toasts, showToast } = useToast();
  const hasValidated = useRef(false);

  useEffect(() => {
    // Prevent duplicate validation calls (e.g., from React StrictMode)
    if (hasValidated.current) {
      return;
    }

    const validateApiKey = async () => {
      hasValidated.current = true;

      // Get API key from sessionStorage
      const apiKey = sessionStorage.getItem("apiKey");

      if (!apiKey) {
        showToast("No API key provided. Please go back to the playground.", "error");
        setValidating(false);
        return;
      }

      try {
        const response = await fetch("/api/keys/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey }),
        });

        const data = await response.json();

        if (data.valid) {
          setIsValid(true);
          showToast("valid api key, /protected can be accessed", "success");
        } else {
          setIsValid(false);
          showToast("api key is invalid", "error");
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        setIsValid(false);
        showToast("Failed to validate API key", "error");
      } finally {
        setValidating(false);
      }
    };

    validateApiKey();
  }, [showToast]);

  const handleGoBack = () => {
    sessionStorage.removeItem("apiKey");
    router.push("/playground");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative">
      <ToastContainer toasts={toasts} />

      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
            Protected Area
          </h1>

          {validating ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Validating API key...
              </p>
            </div>
          ) : isValid ? (
            <div className="py-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">
                  Access Granted
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Your API key is valid. You can now access this protected area.
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
                  Protected Content
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  This is a protected area that requires a valid API key to access.
                  You have successfully authenticated and can now view this content.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">
                  Access Denied
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Your API key is invalid. Please check your key and try again.
                </p>
                <button
                  onClick={handleGoBack}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Go Back to Playground
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
