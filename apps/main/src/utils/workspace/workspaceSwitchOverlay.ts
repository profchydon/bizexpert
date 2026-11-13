export const WORKSPACE_SWITCH_OVERLAY_ID = "workspace-switch-overlay";

export function showImmediateWorkspaceSwitchOverlay() {
  if (globalThis.window === undefined) return;
  if (document.getElementById(WORKSPACE_SWITCH_OVERLAY_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = WORKSPACE_SWITCH_OVERLAY_ID;
  overlay.setAttribute("aria-busy", "true");
  overlay.className =
    "fixed inset-0 z-[9999] flex items-center justify-center bg-primary/80 backdrop-blur-sm";

  const spinner = document.createElement("div");
  spinner.className =
    "size-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-solid";
  overlay.appendChild(spinner);
  document.body.appendChild(overlay);
}

export function removeImmediateWorkspaceSwitchOverlay() {
  if (globalThis.window === undefined) return;
  document.getElementById(WORKSPACE_SWITCH_OVERLAY_ID)?.remove();
}
