import assert from "node:assert/strict";
import test from "node:test";
import { resolveSafeInvoiceUrl } from "./resolveSafeInvoiceUrl";

test("resolveSafeInvoiceUrl accepts http and https invoice links", () => {
  assert.equal(
    resolveSafeInvoiceUrl("https://invoices.airwallex.test/inv.pdf"),
    "https://invoices.airwallex.test/inv.pdf",
  );
});

test("resolveSafeInvoiceUrl rejects unsafe schemes", () => {
  assert.equal(resolveSafeInvoiceUrl("javascript:alert(1)"), null);
  assert.equal(resolveSafeInvoiceUrl(""), null);
});
