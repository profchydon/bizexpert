export const SUBSCRIPTION_RETURN_PATH =
  "/dashboard/settings?settingsType=subscription";

const PENDING_TX_KEY = "rayda.subscription.pending-tx";

export function rememberSubscriptionTxRef(txRef: string | null | undefined) {
  if (typeof sessionStorage === "undefined" || !txRef) return;
  sessionStorage.setItem(PENDING_TX_KEY, txRef);
}

export function rememberedSubscriptionTxRef(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(PENDING_TX_KEY);
}

export function clearSubscriptionTxRef() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_TX_KEY);
}

export function canRetryPlanPayment(
  status: string | null | undefined,
  txRef: string | null,
): boolean {
  return (
    (status ?? "").trim().toLowerCase() === "pending_payment" && Boolean(txRef)
  );
}

export function subscriptionInstancePath(
  instance: "success" | "error" | null,
  txRef?: string | null,
): string {
  const path =
    instance === "success"
      ? `${SUBSCRIPTION_RETURN_PATH}&success_instance=true`
      : instance === "error"
        ? `${SUBSCRIPTION_RETURN_PATH}&error_instance=true`
        : SUBSCRIPTION_RETURN_PATH;
  if (!txRef) return path;
  return `${path}&tx_ref=${encodeURIComponent(txRef)}`;
}

export function subscriptionReturnQuery(search: string): {
  status: string | null;
  txRef: string | null;
} {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  let status = params.get("status");
  let txRef = params.get("tx_ref");
  const settings = params.get("settingsType") ?? "";
  const nestedAt = settings.indexOf("?");
  if (nestedAt >= 0) {
    const nested = new URLSearchParams(settings.slice(nestedAt + 1));
    status = status || nested.get("status");
    txRef = txRef || nested.get("tx_ref");
  }
  return { status, txRef };
}
