export const SUBSCRIPTION_SETTINGS_HREF =
  "/dashboard/settings?settingsType=subscription";

export type SubscriberSavingFields = {
  amount?: number;
  currency?: string | null;
  is_subscribed?: boolean;
  basis?: string;
};

export type SubscriberSaving = SubscriberSavingFields & {
  amount: number;
};

export function readSubscriberSaving(
  source: { savings?: SubscriberSavingFields | null } | null | undefined,
): SubscriberSaving | null {
  const savings = source?.savings;
  if (!savings || typeof savings !== "object") return null;

  const amount = Number(savings.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return {
    amount,
    currency: savings.currency ?? null,
    is_subscribed: Boolean(savings.is_subscribed),
    basis: savings.basis,
  };
}

export function subscriberSavingCopy(isSubscribed: boolean): string {
  return isSubscribed ? "You saved" : "Save about";
}
