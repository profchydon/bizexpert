import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  equipmentHasMissingInformation,
  getImproveEquipmentScoreState,
  normalizeEquipmentStatus,
} from "./equipmentImproveScore.ts";

describe("normalizeEquipmentStatus", () => {
  it("normalizes API status values to lowercase", () => {
    assert.equal(normalizeEquipmentStatus("Assigned"), "assigned");
    assert.equal(normalizeEquipmentStatus("Unassigned"), "unassigned");
    assert.equal(normalizeEquipmentStatus("In_Storage"), "in storage");
  });
});

describe("equipmentHasMissingInformation", () => {
  it("detects missing information from score, flags, and checklist", () => {
    assert.equal(
      equipmentHasMissingInformation({
        score: 90,
        has_missing_information: false,
        missing_information: [],
      }),
      true,
    );
    assert.equal(
      equipmentHasMissingInformation({
        score: 100,
        has_missing_information: true,
      }),
      true,
    );
    assert.equal(
      equipmentHasMissingInformation({
        score: 100,
        has_missing_information: false,
        missing_information: [],
      }),
      false,
    );
  });
});

describe("getImproveEquipmentScoreState", () => {
  it("enables improve score for assigned equipment below 100%", () => {
    const state = getImproveEquipmentScoreState({
      status: "assigned",
      score: 90,
      has_missing_information: false,
      missing_information: [],
    });

    assert.equal(state.isDisabled, false);
    assert.equal(state.reason, null);
  });

  it("disables improve score when the record is complete", () => {
    const state = getImproveEquipmentScoreState({
      status: "Assigned",
      score: 100,
      has_missing_information: false,
      missing_information: [],
    });

    assert.equal(state.isDisabled, true);
    assert.match(state.reason ?? "", /does not have missing information/i);
  });

  it("disables improve score for unsupported lifecycle statuses", () => {
    const state = getImproveEquipmentScoreState({
      status: "in_storage",
      score: 70,
      has_missing_information: true,
    });

    assert.equal(state.isDisabled, true);
    assert.match(state.reason ?? "", /cannot improve the score/i);
  });
});
