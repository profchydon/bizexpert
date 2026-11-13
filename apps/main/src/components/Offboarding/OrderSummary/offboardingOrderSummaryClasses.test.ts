import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("offboarding order summary dividers", () => {
  it("uses light border tokens on equipment item rows", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/Offboarding/OrderSummary/AssociatedDeviceList.tsx",
      ),
      "utf8",
    );

    assert.match(source, /py-2 border-b border-border-secondary/);
    assert.doesNotMatch(source, /border-b-\[1px\]/);
  });

  it("uses border-border-secondary on fee summary separators", () => {
    const orderSummary = readFileSync(
      join(
        process.cwd(),
        "src/components/Offboarding/OrderSummary/OrderSummary.tsx",
      ),
      "utf8",
    );
    const totalSum = readFileSync(
      join(
        process.cwd(),
        "src/components/Offboarding/OrderSummary/TotalSumOrderSummary.tsx",
      ),
      "utf8",
    );

    assert.match(orderSummary, /Separator className="border-gray-200"/);
    assert.match(totalSum, /Separator className="bg-border-secondary"/);
  });
});

describe("payment drawer dividers", () => {
  it("uses the shared checkout drawer and secondary borders on its rows", () => {
    const paymentMethods = readFileSync(
      join(process.cwd(), "src/components/Drawers/PaymentMethods/index.tsx"),
      "utf8",
    );
    const accordion = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/OrderSummary/PaymentDrawer/MethodAccordionRow.tsx",
      ),
      "utf8",
    );
    const totalFeeSummary = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/PaymentMethods/TotalFeeSummary.tsx",
      ),
      "utf8",
    );

    assert.match(paymentMethods, /OrderSummaryPaymentDrawer/);
    assert.match(accordion, /border-t border-secondary/);
    assert.match(totalFeeSummary, /border-b border-border-secondary/);
  });
});

describe("Separator", () => {
  it("defaults to the border-secondary background token", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/ui/separator.tsx"),
      "utf8",
    );

    assert.match(source, /bg-border-secondary/);
    assert.doesNotMatch(source, /bg-gray-200/);
  });
});
