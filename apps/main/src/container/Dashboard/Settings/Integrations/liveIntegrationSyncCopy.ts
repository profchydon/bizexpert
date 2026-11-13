import type { I_RsSyncStatus } from "@/types/integrations";

export function liveIntegrationSyncCopy(
  status?: I_RsSyncStatus | null,
  error?: string | null,
): { label: string; banner: string | null; isFailed: boolean } {
  if (status === "failed") {
    return {
      label: "Sync failed",
      banner: error?.trim() || "Knowledge sync failed. Retry to try again.",
      isFailed: true,
    };
  }

  if (status === "pending" || status === "pending_disconnect") {
    return {
      label: "Connected — finishing setup…",
      banner: "Finishing setup…",
      isFailed: false,
    };
  }

  return {
    label: "Connected and syncing.",
    banner: null,
    isFailed: false,
  };
}
