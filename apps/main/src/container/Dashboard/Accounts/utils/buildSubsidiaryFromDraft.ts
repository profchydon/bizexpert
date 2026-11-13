import { billingEntityById } from "../data/wizardOptions";
import type { CardCaptureOutcome, Subsidiary, SubsidiaryDraft } from "../types";

function newId(name: string, seq: number) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `sub-new-${slug || "entity"}-${seq}`;
}

export function buildSubsidiaryFromDraft(
  draft: SubsidiaryDraft,
  outcome: CardCaptureOutcome,
  seq: number,
): Subsidiary {
  const name = draft.name.trim();
  const delegated = draft.billingMode === "delegated";
  const entity = delegated ? billingEntityById(draft.billingEntityId) : null;
  const currency = delegated
    ? (entity?.currency ?? draft.currency ?? "USD")
    : (draft.currency ?? "USD");
  const stalled = !delegated && outcome === "stalled";
  const id = newId(name, seq);

  return {
    id,
    name: name || "New entity",
    region: draft.region ?? "United States",
    currency,
    admins: [],
    status: stalled ? "card-pending" : "operational",
    officesCount: 0,
    creditState: stalled ? "card-only" : "assessing",
    cardOnFile: !stalled,
    createdDaysAgo: 0,
    createdBy: "You",
    billingMode: draft.billingMode,
    billingEntityId: delegated ? (draft.billingEntityId ?? "") : id,
    billingEntityName: delegated ? (entity?.name ?? "") : name || "New entity",
    billingCurrency: currency,
    ...(delegated
      ? { billingConfirmedAt: "Today", billingConfirmedBy: "You" }
      : {}),
  };
}
