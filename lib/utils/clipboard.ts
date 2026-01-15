import { ERROR_MESSAGES, TOAST_DURATION } from "../constants";
import type { ToastType } from "../types";

type ToastCallback = (message: string, type: ToastType) => void;

/**
 * Copies text to clipboard using the modern Clipboard API with fallback
 */
export async function copyToClipboard(
  text: string,
  showToast: ToastCallback
): Promise<void> {
  try {
    if (!navigator.clipboard) {
      fallbackCopyToClipboard(text, showToast);
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast(ERROR_MESSAGES.COPY_SUCCESS, "success");
  } catch (error) {
    console.error("Clipboard API error:", error);
    try {
      fallbackCopyToClipboard(text, showToast);
    } catch (fallbackError) {
      console.error("Fallback copy error:", fallbackError);
      showToast(ERROR_MESSAGES.COPY_FAILED, "error");
    }
  }
}

/**
 * Fallback method for copying to clipboard using execCommand
 */
function fallbackCopyToClipboard(
  text: string,
  showToast: ToastCallback
): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-999999px";
  textarea.style.top = "-999999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast(ERROR_MESSAGES.COPY_SUCCESS, "success");
    } else {
      throw new Error("execCommand failed");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}
