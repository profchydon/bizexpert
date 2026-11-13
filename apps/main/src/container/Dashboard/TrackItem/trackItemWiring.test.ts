import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("track item page is wired to the TrackItem container", () => {
  const page = readFileSync(
    "src/app/dashboard/inventory/track-item/page.tsx",
    "utf8",
  );
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/TrackItem"), true);
});

test("track item lookup uses barcode search and inventory history", () => {
  const api = readFileSync(
    "src/container/Dashboard/TrackItem/trackItemApi.ts",
    "utf8",
  );
  const results = readFileSync(
    "src/container/Dashboard/TrackItem/TrackItemResults.tsx",
    "utf8",
  );
  const nav = readFileSync(
    "src/app/dashboard/NavBar/bizexpertNavItems.ts",
    "utf8",
  );
  const routes = readFileSync("src/routes.ts", "utf8");
  assert.equal(api.includes("/products/by-barcode/"), true);
  assert.equal(api.includes("/products/search"), true);
  assert.equal(results.includes("/inventory/balances"), true);
  assert.equal(results.includes("/inventory/movements"), true);
  assert.equal(results.includes("productId: product.id"), true);
  assert.equal(nav.includes("Track item"), true);
  assert.equal(
    routes.includes('TRACK_ITEM: "/dashboard/inventory/track-item"'),
    true,
  );
});
