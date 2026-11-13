import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countOrderSummaryItems,
  pickOrderSummaryFeeDisplay,
  type OrderSummaryFeeDisplay,
} from "./pickOrderSummaryFeeDisplay";

const source = (
  overrides: Partial<OrderSummaryFeeDisplay>,
): OrderSummaryFeeDisplay => ({
  rows: [],
  totalEquipment: 0,
  isLoading: false,
  isError: false,
  ...overrides,
});

describe("pickOrderSummaryFeeDisplay", () => {
  const approval = source({ totalEquipment: 1 });
  const equip = source({ totalEquipment: 2 });
  const storageActions = source({ totalEquipment: 3 });
  const onboard = source({ totalEquipment: 4 });

  it("prefers approval, then equip-employee, then storage-actions", () => {
    assert.equal(
      pickOrderSummaryFeeDisplay({
        isApprovalOrderSummaryFlow: true,
        isEquipEmployeeFlow: true,
        isStorageActionsFlow: true,
        approval,
        equip,
        storageActions,
        onboard,
      }),
      approval,
    );
    assert.equal(
      pickOrderSummaryFeeDisplay({
        isApprovalOrderSummaryFlow: false,
        isEquipEmployeeFlow: true,
        isStorageActionsFlow: true,
        approval,
        equip,
        storageActions,
        onboard,
      }),
      equip,
    );
    assert.equal(
      pickOrderSummaryFeeDisplay({
        isApprovalOrderSummaryFlow: false,
        isEquipEmployeeFlow: false,
        isStorageActionsFlow: true,
        approval,
        equip,
        storageActions,
        onboard,
      }),
      storageActions,
    );
    assert.equal(
      pickOrderSummaryFeeDisplay({
        isApprovalOrderSummaryFlow: false,
        isEquipEmployeeFlow: false,
        isStorageActionsFlow: false,
        approval,
        equip,
        storageActions,
        onboard,
      }),
      onboard,
    );
  });
});

describe("countOrderSummaryItems", () => {
  it("sums item rows across employees", () => {
    assert.equal(countOrderSummaryItems(undefined), 0);
    assert.equal(
      countOrderSummaryItems([{ items: [{}, {}] }, { items: [{}] }]),
      3,
    );
  });
});
