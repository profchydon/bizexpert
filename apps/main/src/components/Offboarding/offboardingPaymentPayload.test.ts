import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { transformDataForOffboardingPayment } from "./offboardingPayload";

const window = { start: "2026-06-24", end: "2026-06-26" };

const group = (assigneeId: string, assets: any[]) => ({
  assignee: { id: assigneeId },
  assets,
});

describe("transformDataForOffboardingPayment (employee off-boarding)", () => {
  const output = transformDataForOffboardingPayment({
    items: [
      group("emp-1", [
        { id: "eq-1", actionType: "Archive", collectionWindow: window },
        {
          id: "eq-2",
          actionType: "Store",
          factoryReset: true,
          collectionWindow: window,
        },
        {
          id: "eq-3",
          actionType: "Transfer",
          receiver: { id: "emp-9" },
          collectionWindow: window,
        },
      ]),
    ],
    feeData: { "emp-1": { fees: { total_fee: 250 } } },
    isSignatureRequired: true,
    isEmployeeOffboarding: true,
  });
  const equipment = output["emp-1"].equipment;

  it("carries the per-assignee total fee", () => {
    assert.equal(output["emp-1"].total_fee, 250);
  });

  it("sends collection_date as a start/end window", () => {
    assert.deepEqual(equipment[0].collection_date, window);
  });

  it("sends dispose (not archive) for disposed devices", () => {
    assert.equal(equipment[0].dispose, true);
    assert.equal(equipment[0].archive, undefined);
  });

  it("adds factory_reset alongside the offboarding type", () => {
    assert.equal(equipment[1].storage, true);
    assert.equal(equipment[1].factory_reset, true);
  });

  it("keeps reassign target and signature request", () => {
    assert.equal(equipment[2].reassign, true);
    assert.equal(equipment[2].assignee, "emp-9");
    assert.equal(equipment[0].signature_requested, true);
  });

  it("falls back to an empty window when none is set", () => {
    const result = transformDataForOffboardingPayment({
      items: [group("emp-1", [{ id: "eq-1", actionType: "Store" }])],
      feeData: {},
      isSignatureRequired: false,
      isEmployeeOffboarding: true,
    });
    assert.deepEqual(result["emp-1"].equipment[0].collection_date, {
      start: "",
      end: "",
    });
  });
});

describe("transformDataForOffboardingPayment (regular off-boarding)", () => {
  it("keeps archive and an empty start/end window without a date", () => {
    const output = transformDataForOffboardingPayment({
      items: [group("emp-1", [{ id: "eq-1", actionType: "Archive" }])],
      feeData: {},
      isSignatureRequired: false,
    });
    const [equipment] = output["emp-1"].equipment;
    assert.equal(equipment.archive, true);
    assert.equal(equipment.dispose, undefined);
    assert.deepEqual(equipment.collection_date, { start: "", end: "" });
  });

  it("sends the single collection date as a start/end window", () => {
    const output = transformDataForOffboardingPayment({
      items: [
        group("emp-1", [
          {
            id: "eq-1",
            actionType: "Store",
            collectionDate: new Date(2026, 5, 8),
          },
        ]),
      ],
      feeData: {},
      isSignatureRequired: false,
    });
    assert.deepEqual(output["emp-1"].equipment[0].collection_date, {
      start: "2026-06-08",
      end: "2026-06-08",
    });
  });
});
