"use client";

import Loader from "@/components/Loader";
import { useWorkspaceSwitchLoadingOverlay } from "@/hooks/useWorkspaceSwitchLoadingOverlay";

export function WorkspaceSwitchLoadingOverlay() {
  const isSwitching = useWorkspaceSwitchLoadingOverlay();

  if (!isSwitching) return null;

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-primary/80 backdrop-blur-sm"
    >
      <Loader />
    </div>
  );
}
