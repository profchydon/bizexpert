export interface CompanyField {
  label: string;
  value: string;
  badge?: boolean;
  badgeTooltip?: string;
  muted?: boolean;
}

export interface CompanyInfoSource {
  created_at?: Date | string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  size?: string | null;
  trading_name?: string | null;
  subscription?: { plan?: { name?: string | null } | null } | null;
}

function textValue(value: string | null | undefined): {
  value: string;
  muted: boolean;
} {
  const trimmed = value?.trim() ?? "";
  return trimmed
    ? { value: trimmed, muted: false }
    : { value: "Not set", muted: true };
}

export function buildCompanyFields(company: CompanyInfoSource): CompanyField[] {
  const created = company.created_at
    ? new Date(company.created_at).toDateString()
    : "";
  const plan = company.subscription?.plan?.name?.trim() ?? "";
  const trade = textValue(company.trading_name);

  return [
    { label: "Date created", ...textValue(created) },
    { label: "Phone number", ...textValue(company.phone) },
    { label: "Email address", ...textValue(company.email) },
    { label: "Website", ...textValue(company.website) },
    { label: "Employees size", ...textValue(company.size) },
    { label: "Trade name", value: trade.value, muted: trade.muted },
    plan
      ? {
          label: "Subscription plan",
          value: plan,
          badge: true,
          badgeTooltip: "Your current Rayda plan tier.",
        }
      : { label: "Subscription plan", value: "Not set", muted: true },
  ];
}
