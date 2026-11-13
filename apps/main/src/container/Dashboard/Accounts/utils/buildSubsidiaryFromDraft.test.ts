import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SubsidiaryDraft } from "../types";
import { buildSubsidiaryFromDraft } from "./buildSubsidiaryFromDraft";

const selfDraft: SubsidiaryDraft = {
  name: "Acme UK Ltd",
  email: "acme-uk@mailinator.com",
  region: "United Kingdom",
  currency: "GBP",
  adminUserIds: ["user-1"],
  billingMode: "self",
  billingEntityId: null,
};

const delegatedDraft: SubsidiaryDraft = {
  name: "Rayda Canada Inc",
  email: "canada@mailinator.com",
  region: "Canada",
  currency: null,
  adminUserIds: ["user-2"],
  billingMode: "delegated",
  billingEntityId: "sub-hq",
};

describe("buildSubsidiaryFromDraft", () => {
  it("builds an operational self-billed entity on successful card capture", () => {
    const subsidiary = buildSubsidiaryFromDraft(selfDraft, "success", 0);

    assert.equal(subsidiary.name, "Acme UK Ltd");
    assert.equal(subsidiary.currency, "GBP");
    assert.equal(subsidiary.status, "operational");
    assert.equal(subsidiary.cardOnFile, true);
    assert.equal(subsidiary.billingMode, "self");
    assert.equal(subsidiary.billingEntityId, subsidiary.id);
  });

  it("marks self-billed entities as card-pending when capture stalls", () => {
    const subsidiary = buildSubsidiaryFromDraft(selfDraft, "stalled", 1);

    assert.equal(subsidiary.status, "card-pending");
    assert.equal(subsidiary.creditState, "card-only");
    assert.equal(subsidiary.cardOnFile, false);
  });

  it("inherits billing from the selected entity for delegated mode", () => {
    const subsidiary = buildSubsidiaryFromDraft(delegatedDraft, "success", 2);

    assert.equal(subsidiary.billingMode, "delegated");
    assert.equal(subsidiary.billingEntityId, "sub-hq");
    assert.equal(subsidiary.status, "operational");
    assert.equal(subsidiary.billingConfirmedAt, "Today");
  });
});
