"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseCopyOptions {
  successMessage?: string;
  errorMessage?: string;
}

interface UseCopyReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

export function useCopy(options: UseCopyOptions = {}): UseCopyReturn {
  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy",
  } = options;

  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      toast.success(successMessage, {
        duration: 2000,
        icon: "✓",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage]);

  return { copied, copy };
}
