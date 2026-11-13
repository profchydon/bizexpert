import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getBulkActionDisabledReason,
  isBulkActionEligible,
  isBulkStoreEligible,
  isBulkTransferEligible,
  isRowTransferEligible,
} from "./equipmentBulkActionEligibility.ts";

import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

describe("equipmentBulkActionEligibility", () => {
  it("limits bulk reassign and store to assigned equipment", () => {
    assert.equal(isBulkTransferEligible("Unassigned"), false);
    assert.equal(isBulkTransferEligible("unassigned"), false);
    assert.equal(isBulkTransferEligible("assigned"), true);
    assert.equal(isBulkStoreEligible(UNASSIGNED_ORDER_SUMMARY_KEY), false);
    assert.equal(isBulkStoreEligible("unassigned"), false);
    assert.equal(isBulkStoreEligible("assigned"), true);
    assert.equal(isBulkActionEligible("in_storage", "transfer"), false);
  });

  it("returns status-specific disabled reasons", () => {
    assert.match(
      getBulkActionDisabledReason([{ status: "in_storage" }], "transfer") ?? "",
      /in storage/i,
    );
    assert.match(
      getBulkActionDisabledReason([{ status: "Unassigned" }], "transfer") ?? "",
      /unassigned equipment/i,
    );
    assert.match(
      getBulkActionDisabledReason([{ status: "Unassigned" }], "store") ?? "",
      /unassigned equipment/i,
    );
    assert.match(
      getBulkActionDisabledReason([{ status: "In Storage" }], "store") ?? "",
      /already in storage/i,
    );
    assert.equal(
      getBulkActionDisabledReason([{ status: "assigned" }], "transfer"),
      null,
    );
  });

  it("lists blocking statuses when the selection is mixed", () => {
    assert.match(
      getBulkActionDisabledReason(
        [{ status: "assigned" }, { status: "sold" }, { status: "in_storage" }],
        "transfer",
      ) ?? "",
      /Sold, In storage/i,
    );
  });

  it("keeps row assign available for unassigned lifecycle status", () => {
    assert.equal(isRowTransferEligible("Unassigned"), true);
    assert.equal(isRowTransferEligible("assigned"), true);
    assert.equal(isRowTransferEligible("in_storage"), false);
  });
});
