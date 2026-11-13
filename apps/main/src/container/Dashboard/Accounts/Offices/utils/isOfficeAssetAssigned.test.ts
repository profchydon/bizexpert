import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  hasAssignedOfficeAssets,
  isOfficeAssetAssigned,
} from "./isOfficeAssetAssigned";

const asset = (fields: { assigneeId?: string; assigneeName?: string }) => ({
  assigneeId: "",
  assigneeName: "",
  ...fields,
});

describe("isOfficeAssetAssigned", () => {
  it("treats an asset with an assignee id as assigned", () => {
    assert.equal(isOfficeAssetAssigned(asset({ assigneeId: "emp-1" })), true);
  });

  it("treats an asset with an assignee name and no id as assigned", () => {
    assert.equal(
      isOfficeAssetAssigned(asset({ assigneeName: "Tunji Ade" })),
      true,
    );
  });

  it("treats office-only assets as unassigned", () => {
    assert.equal(isOfficeAssetAssigned(asset({})), false);
    assert.equal(isOfficeAssetAssigned(asset({ assigneeId: "  " })), false);
  });
});

describe("hasAssignedOfficeAssets", () => {
  it("is false when every selected asset is unassigned", () => {
    assert.equal(hasAssignedOfficeAssets([asset({}), asset({})]), false);
  });

  it("is true when any selected asset is assigned", () => {
    assert.equal(
      hasAssignedOfficeAssets([
        asset({}),
        asset({ assigneeId: "emp-1", assigneeName: "Tunji Ade" }),
      ]),
      true,
    );
  });

  it("is false for an empty selection", () => {
    assert.equal(hasAssignedOfficeAssets([]), false);
  });
});
