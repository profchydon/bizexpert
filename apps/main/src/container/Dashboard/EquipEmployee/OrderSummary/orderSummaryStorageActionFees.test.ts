import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("order summary storage action fees", () => {
  it("uses workspace-scoped POST /fees/storage/actions on the storage-actions flow", () => {
    const page = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryUpdated.tsx",
      ),
      "utf8",
    );
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/useStorageActionFees.ts",
      ),
      "utf8",
    );

    assert.match(page, /STORAGE_ACTIONS_FLOW/);
    assert.match(page, /useStorageActionFees\(/);
    assert.match(page, /isStorageActionsFlow,/);
    assert.match(page, /tabState,/);
    assert.match(page, /storageActionCountryNameFromItems/);
    assert.match(page, /storageActionsCountryId: storageActions.countryId/);
    assert.match(page, /storageActionsOrders: storageActions.orders/);
    assert.match(hook, /useGetStorageActionFeesQuery/);
    assert.match(hook, /useWorkspaceCompanyId/);
    assert.match(hook, /payment_method: paymentMethod/);
    assert.match(hook, /country_id: countryId/);
    assert.match(hook, /orders,/);
    assert.match(hook, /toStorageActionFeeOrders/);
    assert.match(hook, /resolveStorageActionCountryId/);
    assert.match(
      hook,
      /enabled && companyId && countryId && orders.length > 0/,
    );
  });
});
