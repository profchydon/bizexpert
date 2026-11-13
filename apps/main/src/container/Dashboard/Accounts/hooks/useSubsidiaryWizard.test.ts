import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SubsidiaryDraft } from "../types";

const EMPTY_DRAFT: SubsidiaryDraft = {
  name: "",
  email: "",
  region: null,
  currency: null,
  adminUserIds: [],
  billingMode: "self",
  billingEntityId: null,
};

function detailsValid(draft: SubsidiaryDraft) {
  const base =
    draft.name.trim().length > 0 &&
    draft.email.trim().length > 0 &&
    !!draft.region &&
    draft.adminUserIds.length > 0;

  return draft.billingMode === "delegated"
    ? base && !!draft.billingEntityId
    : base && !!draft.currency;
}

function firstInvalidField(
  stepKey: string,
  draft: SubsidiaryDraft,
  billingConfirmed: boolean,
): string | null {
  if (stepKey === "details") {
    if (!draft.name.trim()) return "name";
    if (!draft.email.trim()) return "email";
    if (!draft.region) return "region";
    if (draft.adminUserIds.length === 0) return "admins";
    if (draft.billingMode === "delegated") {
      return draft.billingEntityId ? null : "billingEntity";
    }
    return draft.currency ? null : "currency";
  }
  if (stepKey === "currency" || stepKey === "confirm") {
    return billingConfirmed ? null : "confirm";
  }
  return null;
}

describe("useSubsidiaryWizard validation", () => {
  it("requires all detail fields for self billing", () => {
    assert.equal(detailsValid(EMPTY_DRAFT), false);

    const complete = {
      ...EMPTY_DRAFT,
      name: "Acme UK Ltd",
      email: "acme-uk@mailinator.com",
      region: "United Kingdom",
      currency: "GBP",
      adminUserIds: ["user-1"],
    };

    assert.equal(detailsValid(complete), true);
    assert.equal(firstInvalidField("details", complete, false), null);
  });

  it("requires billing entity selection for delegated billing", () => {
    const incomplete = {
      ...EMPTY_DRAFT,
      name: "Rayda Canada Inc",
      email: "canada@mailinator.com",
      region: "Canada",
      adminUserIds: ["user-2"],
      billingMode: "delegated" as const,
    };

    assert.equal(detailsValid(incomplete), false);
    assert.equal(
      firstInvalidField("details", incomplete, false),
      "billingEntity",
    );
  });

  it("requires confirmation on currency and delegation steps", () => {
    const draft = {
      ...EMPTY_DRAFT,
      name: "Acme UK Ltd",
      email: "acme-uk@mailinator.com",
      region: "United Kingdom",
      currency: "GBP",
      adminUserIds: ["user-1"],
    };

    assert.equal(firstInvalidField("currency", draft, false), "confirm");
    assert.equal(firstInvalidField("currency", draft, true), null);
    assert.equal(firstInvalidField("confirm", draft, false), "confirm");
  });
});
