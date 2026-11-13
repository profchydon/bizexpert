import assert from "node:assert/strict";
import { describe, it } from "node:test";
import routes from "@/routes";
import {
  buildCreateEntityPayload,
  ENTITY_CREATE_RETURN_PATH,
} from "./buildCreateEntityPayload";
import type { SubsidiaryDraft } from "../types";

const baseDraft: SubsidiaryDraft = {
  name: "Acme UK Ltd",
  email: "acme-uk@mailinator.com",
  region: "United Kingdom",
  currency: "GBP",
  adminUserIds: ["2df6a841-5d9a-45b9-b004-09ebb72f1dd9"],
  billingMode: "self",
  billingEntityId: null,
};

describe("buildCreateEntityPayload", () => {
  it("uses the accounts route for self-billing card capture return", () => {
    assert.equal(ENTITY_CREATE_RETURN_PATH, routes.ACCOUNTS);
  });

  it("builds a self-billing payload with billing currency and return_path", () => {
    assert.deepEqual(buildCreateEntityPayload(baseDraft), {
      name: "Acme UK Ltd",
      email: "acme-uk@mailinator.com",
      country: "United Kingdom",
      billing_currency: "GBP",
      return_path: routes.ACCOUNTS,
      admin_user_ids: ["2df6a841-5d9a-45b9-b004-09ebb72f1dd9"],
    });
  });

  it("builds a delegated payload without return_path or billing currency", () => {
    const payload = buildCreateEntityPayload({
      ...baseDraft,
      billingMode: "delegated",
      billingEntityId: "entity-uk",
      currency: "GBP",
    });

    assert.deepEqual(payload, {
      name: "Acme UK Ltd",
      email: "acme-uk@mailinator.com",
      country: "United Kingdom",
      delegated_payer_id: "entity-uk",
      admin_user_ids: ["2df6a841-5d9a-45b9-b004-09ebb72f1dd9"],
    });
    assert.equal("return_path" in payload, false);
  });
});
