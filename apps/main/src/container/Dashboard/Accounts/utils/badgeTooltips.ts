import type { BadgeColors } from "@/components/base/badges/badge-types";
import {
  UNMAPPED_SUBSIDIARY_STATUS,
  type BillingMode,
  type CreditState,
  type SubsidiaryStatus,
} from "../types";

export const statusLabel: Record<SubsidiaryStatus, string> = {
  operational: "Operational",
  "card-pending": "Card pending",
  suspended: "Suspended",
  "permanent-card-only": "Card-only",
  closed: "Closed",
  delegated: "Delegated",
  [UNMAPPED_SUBSIDIARY_STATUS]: "N/A",
};

export const statusFilterOptions = Object.entries(statusLabel).map(
  ([id, label]) => ({ id, label }),
);

export const entityStatusFilterOptions = statusFilterOptions.filter(
  (option) => option.id !== UNMAPPED_SUBSIDIARY_STATUS,
);

export const statusColor: Record<SubsidiaryStatus, BadgeColors> = {
  operational: "success",
  "card-pending": "warning",
  suspended: "error",
  "permanent-card-only": "orange",
  closed: "gray",
  delegated: "blue",
  [UNMAPPED_SUBSIDIARY_STATUS]: "gray",
};

export const statusTooltip: Record<SubsidiaryStatus, string> = {
  operational: "Active and billing normally",
  "card-pending": "Blocked until a card is added",
  suspended: "Credit paused, invoice overdue",
  "permanent-card-only": "Card-only after repeat suspension",
  closed: "Wound down",
  delegated: "Billing handled by another entity in the account",
  [UNMAPPED_SUBSIDIARY_STATUS]:
    "Billing status is unavailable or not recognized",
};

export const statusImplication: Record<SubsidiaryStatus, string> = {
  operational:
    "Card on file, with invoicing and Net-30 credit running as usual.",
  "card-pending":
    "Visible in your account but can't be billed yet. Add a card to activate it.",
  suspended:
    "An invoice is 15+ days overdue. Settle it to restore this entity's credit.",
  "permanent-card-only":
    "Second suspension in 12 months. A CEO override is required to restore credit.",
  closed: "Its billing cycle has stopped and it can't be billed again.",
  delegated: "This entity's billing is handled by its delegated payer entity.",
  [UNMAPPED_SUBSIDIARY_STATUS]:
    "The API returned a billing status badge we do not map yet.",
};

export const creditLabel: Record<CreditState, string> = {
  "card-only": "Card only",
  assessing: "Assessing",
  "active-credit": "Net 30",
};

export const creditColor: Record<CreditState, BadgeColors> = {
  "card-only": "gray",
  assessing: "blue",
  "active-credit": "success",
};

export const creditTooltip: Record<CreditState, string> = {
  "card-only":
    "Invoices charged to the card on file. Not yet qualified for Net-30 credit.",
  assessing:
    "Within the Day-60 window. Credit eligibility is assessed on this entity's own history.",
  "active-credit":
    "Qualified for Net-30 credit up to this entity's own approved limit.",
};

export const billingModeLabel: Record<BillingMode, string> = {
  self: "Self-billing",
  delegated: "Delegated",
};

export const billingModeColor: Record<BillingMode, BadgeColors> = {
  self: "gray",
  delegated: "blue",
};

export const billingModeTooltip: Record<BillingMode, string> = {
  self: "This entity is billed on its own account, with its own currency and payment method.",
  delegated:
    "Billing is handled by another entity in the account. Set at creation and permanent.",
};

export const CURRENCY_TOOLTIP =
  "Locked billing currency. Permanent and independent of the parent Company.";

export const PRIMARY_LABEL = "Primary";
export const PRIMARY_TOOLTIP =
  "Your main billing entity, created at signup. It can't be closed.";
