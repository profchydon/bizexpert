"use client";

import { useCallback, useState } from "react";

export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState<string | boolean>(false);

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        window.setTimeout(() => setCopied(false), resetMs);
      } catch {
        setCopied(false);
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
