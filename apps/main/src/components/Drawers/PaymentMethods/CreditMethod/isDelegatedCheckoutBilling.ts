export type BillingSignalSource =
  | {
      billing_responsibility?: string | null;
      billing_status_badge?: string | null;
      billing_arrangement?: { mode?: string | null } | null;
    }
  | null
  | undefined;

export const MASKED_WALLET_AMOUNT = "••••••";
export const DELEGATED_WALLET_NOTE = "This order is billed to another entity.";

export function isDelegatedBillingSource(source: BillingSignalSource): boolean {
  if (!source) {
    return false;
  }

  return (
    source.billing_responsibility === "delegated" ||
    source.billing_status_badge === "delegated" ||
    source.billing_arrangement?.mode === "delegated"
  );
}

export function hasBillingSignal(source: BillingSignalSource): boolean {
  if (!source) {
    return false;
  }

  return Boolean(
    source.billing_responsibility ||
    source.billing_status_badge ||
    source.billing_arrangement?.mode,
  );
}

export function resolveDelegatedBilling({
  membership,
  entity,
  entityLoading,
}: {
  membership?: BillingSignalSource;
  entity?: BillingSignalSource;
  entityLoading: boolean;
}): { isDelegated: boolean; isResolving: boolean } {
  if (
    isDelegatedBillingSource(membership) ||
    isDelegatedBillingSource(entity)
  ) {
    return { isDelegated: true, isResolving: false };
  }

  if (hasBillingSignal(membership) || hasBillingSignal(entity)) {
    return { isDelegated: false, isResolving: false };
  }

  return { isDelegated: false, isResolving: entityLoading };
}
