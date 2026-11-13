import assert from "node:assert/strict";
import { test } from "node:test";
import { toAddUnitPayload } from "./ProductDetail/unitSchema";
import {
  productDeactivateDescription,
  productDeactivateTitle,
} from "./deleteProductCopy";

test("toAddUnitPayload omits a zero selling price", () => {
  assert.deepEqual(
    toAddUnitPayload({
      unitName: "  carton  ",
      conversionFactor: 12,
      sellingPrice: 0,
    }),
    {
      unitName: "carton",
      conversionFactor: 12,
      sellingPrice: undefined,
    },
  );
});

test("deactivate copy names the product", () => {
  assert.equal(productDeactivateTitle(), "Deactivate product");
  assert.equal(
    productDeactivateDescription("Rice"),
    "This will deactivate Rice in your catalog. Existing sales and stock history stay in the system.",
  );
});
