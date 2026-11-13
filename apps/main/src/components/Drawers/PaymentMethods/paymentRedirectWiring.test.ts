import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("payment redirect wiring", () => {
  it("tracks Payment method redirect until hosted checkout opens", () => {
    const methods = readFileSync(
      join(process.cwd(), "src/components/Drawers/PaymentMethods/index.tsx"),
      "utf8",
    );
    const payment = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/useOrderSummaryPayment.ts",
      ),
      "utf8",
    );
    const transactions = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Transactions/TransactionNestedPages/index.tsx",
      ),
      "utf8",
    );
    const result = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Transactions/TransactionNestedPages/useTransactionPaymentResult.ts",
      ),
      "utf8",
    );

    assert.match(methods, /OrderSummaryPaymentDrawer/);
    const drawer = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/OrderSummaryPaymentDrawer.tsx",
      ),
      "utf8",
    );
    const panels = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/PaymentDrawer/MethodPanels.tsx",
      ),
      "utf8",
    );
    assert.match(drawer, /canClosePaymentMethod\(isLoading\)/);
    assert.match(panels, /Redirecting…/);
    assert.match(payment, /usePaymentRedirect/);
    assert.match(payment, /beginRedirect/);
    assert.match(payment, /isRedirecting \|\|/);
    assert.match(transactions, /useTransactionPaymentResult/);
    assert.match(result, /useCancelledCheckoutReturn/);
    assert.match(result, /shouldApplyPaymentVerify/);
    assert.match(result, /handledRef/);
    assert.match(result, /clearStorageActionsCart/);
  });
});
