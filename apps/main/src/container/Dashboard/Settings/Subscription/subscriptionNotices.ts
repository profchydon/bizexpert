import type { BannerTone } from "@/components/application/alerts/banner";
import { endedPlanCopy } from "./endedPlanCopy";
import { formatBillingDate } from "./subscriptionView";

export type NoticeKind = "error" | "ended" | "scheduled" | "pending";

export interface SubscriptionNotice {
  tone: BannerTone;
  kind: NoticeKind;
  title: string;
  description: string;
  cta?: string;
}

export function statusNotice(input: {
  status: string | null | undefined;
  planName: string;
  periodEnd: string;
  freePlanName?: string;
}): SubscriptionNotice | null {
  const status = (input.status ?? "").trim().toLowerCase();
  if (status === "past_due") {
    const when = input.periodEnd ? ` by ${input.periodEnd}` : "";
    return {
      tone: "error",
      kind: "error",
      title: "Your renewal is past due",
      description: `Settle the ${input.planName} renewal${when} to keep this plan. Overdue accounts are suspended.`,
    };
  }
  if (status === "suspended") {
    return {
      tone: "error",
      kind: "error",
      title: "This account is suspended",
      description:
        "The account is overdue. Access stays limited until it is in good standing.",
    };
  }
  if (status === "pending_payment") {
    return {
      tone: "warning",
      kind: "pending",
      title: "Payment pending",
      description: `${input.planName} stays in place until the invoice is paid.`,
    };
  }
  if (status === "cancelled" || status === "expired") {
    const copy = endedPlanCopy({
      planName: input.planName,
      endedOn: input.periodEnd,
      freePlanName: input.freePlanName ?? "",
    });
    return {
      tone: "neutral",
      kind: "ended",
      title: copy.title,
      description: copy.description,
      cta: copy.cta,
    };
  }
  return null;
}

export function scheduledNotice(input: {
  planName: string;
  at: string | null | undefined;
}): SubscriptionNotice {
  const when = formatBillingDate(input.at) || "your next renewal";
  return {
    tone: "neutral",
    kind: "scheduled",
    title: "Plan change scheduled",
    description: `${input.planName} starts on ${when}.`,
    cta: "Cancel change",
  };
}

export function pageNotice(input: {
  status: string | null | undefined;
  planName: string;
  periodEnd: string;
  freePlanName?: string;
  expiredFrom?: {
    planName: string;
    endedOn: string;
    currentPlanName: string;
  } | null;
  scheduled: { planName: string; at: string | null | undefined } | null;
}): SubscriptionNotice | null {
  const status = statusNotice(input);
  if (status && status.kind !== "ended") {
    if (!input.scheduled) return status;
    if (status.kind === "pending") {
      return { ...status, cta: "Cancel change" };
    }
    return status;
  }
  const previous = input.expiredFrom;
  if (previous?.planName) {
    const same =
      previous.currentPlanName.toLowerCase() ===
      previous.planName.toLowerCase();
    const copy = endedPlanCopy({
      planName: previous.planName,
      endedOn: previous.endedOn,
      freePlanName: same ? "" : previous.currentPlanName,
    });
    return {
      tone: "neutral",
      kind: "ended",
      title: copy.title,
      description: copy.description,
      cta: copy.cta,
    };
  }
  if (status) return status;
  if (!input.scheduled) return null;
  return scheduledNotice(input.scheduled);
}
