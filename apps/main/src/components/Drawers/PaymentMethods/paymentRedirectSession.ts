export const PAYMENT_REDIRECT_KEY = "payment_method_redirect";

export type PaymentRedirectTab = "Card" | "Credit";

export type PendingPaymentRedirect = {
  returnPath: string;
  tabState: PaymentRedirectTab;
  selectedCardValue?: string;
  order_id?: string;
  order_flow?: string;
};

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function defaultStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function parsePaymentRedirectTab(
  value: unknown,
): PaymentRedirectTab | null {
  if (value === "Card" || value === "Credit") return value;
  return null;
}

export function parsePendingPaymentRedirect(
  raw: string | null,
): PendingPaymentRedirect | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PendingPaymentRedirect>;
    const returnPath = parsed?.returnPath?.trim();
    const tabState = parsePaymentRedirectTab(parsed?.tabState);
    if (!returnPath?.startsWith("/") || !tabState) return null;

    const selectedCardValue = parsed.selectedCardValue?.trim();
    const orderId = parsed.order_id?.trim();
    const orderFlow = parsed.order_flow?.trim();
    return {
      returnPath,
      tabState,
      ...(selectedCardValue ? { selectedCardValue } : {}),
      ...(orderId ? { order_id: orderId } : {}),
      ...(orderFlow ? { order_flow: orderFlow } : {}),
    };
  } catch {
    return null;
  }
}

export function stashPendingPaymentRedirect(
  pending: PendingPaymentRedirect,
  storage: StorageLike | null = defaultStorage(),
) {
  if (!storage) return;
  storage.setItem(PAYMENT_REDIRECT_KEY, JSON.stringify(pending));
}

export function peekPendingPaymentRedirect(
  storage: StorageLike | null = defaultStorage(),
): PendingPaymentRedirect | null {
  if (!storage) return null;
  return parsePendingPaymentRedirect(storage.getItem(PAYMENT_REDIRECT_KEY));
}

export function clearPendingPaymentRedirect(
  storage: StorageLike | null = defaultStorage(),
) {
  storage?.removeItem(PAYMENT_REDIRECT_KEY);
}

export function consumeIfReturnPathMatches(
  currentPath: string,
  storage: StorageLike | null = defaultStorage(),
): PendingPaymentRedirect | null {
  const pending = peekPendingPaymentRedirect(storage);
  if (!shouldRestorePaymentDrawer(pending, currentPath)) return null;
  clearPendingPaymentRedirect(storage);
  return pending;
}

export function shouldRestorePaymentDrawer(
  pending: PendingPaymentRedirect | null,
  currentPath: string,
): pending is PendingPaymentRedirect {
  return Boolean(pending && pending.returnPath === currentPath);
}

export function hasCheckoutPaymentResult(params: {
  errorInstance: string | null;
  successInstance: string | null;
  txRef: string | null;
}) {
  return Boolean(
    params.txRef || params.successInstance || params.errorInstance,
  );
}

export function cancelledCheckoutReturnPath(
  pending: PendingPaymentRedirect | null,
  currentPath: string,
  hasPaymentResult: boolean,
): string | null {
  if (hasPaymentResult || !pending?.returnPath) return null;
  if (pending.returnPath === currentPath) return null;
  return pending.returnPath;
}

export function beginPaymentRedirect(
  link: string,
  pending: PendingPaymentRedirect,
  assign: (url: string) => void,
  storage: StorageLike | null = defaultStorage(),
) {
  if (!link) return false;
  stashPendingPaymentRedirect(pending, storage);
  assign(link);
  return true;
}
