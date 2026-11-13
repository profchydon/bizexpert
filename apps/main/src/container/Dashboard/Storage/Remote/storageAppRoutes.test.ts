import assert from "node:assert/strict";
import { test } from "node:test";
import routes from "@/routes";
import { storageAppRoutes } from "./storageAppRoutes";

test("storage app routes map to dashboard paths", () => {
  assert.equal(storageAppRoutes.dashboard, routes.OVERVIEW);
  assert.equal(storageAppRoutes.storage, routes.STORAGE);
  assert.equal(storageAppRoutes.storageImport, routes.STORAGE_IMPORT);
  assert.equal(
    storageAppRoutes.storageUnifiedCheckout,
    `${routes.STORAGE}/unified-checkout`,
  );
  assert.equal(
    storageAppRoutes.storageOrderSummary,
    routes.STORAGE_ORDER_SUMMARY,
  );
  assert.equal(
    storageAppRoutes.orderDetails("ORD-1"),
    `${routes.ORDERS}/ORD-1`,
  );
});
