export type OverviewQuickAction = {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  featureGate?: string;
};

export const isOverviewQuickActionEnabled = (
  action: OverviewQuickAction,
  features?: string[],
) => {
  if (!action.featureGate) {
    return true;
  }

  return features?.includes(action.featureGate) ?? false;
};
