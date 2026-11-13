import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProductImportCsv } from "./productCsvParse";

test("parseProductImportCsv reads template rows", () => {
  const csv =
    "location_name,product_name,category,sku,barcode,unit,type,selling_price,cost_price,opening_quantity\n" +
    "Main shop,Indomie,Food,SKU-1,,piece,product,150,110,5\n";
  const parsed = parseProductImportCsv(csv);
  assert.equal(parsed.error, undefined);
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0]?.locationName, "Main shop");
  assert.equal(parsed.rows[0]?.openingQuantity, 5);
});
