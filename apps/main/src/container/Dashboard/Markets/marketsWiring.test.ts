import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("integrations pages are wired to the Remote markets containers", () => {
  const page = readFileSync("src/app/dashboard/integrations/page.tsx", "utf8");
  const detail = readFileSync(
    "src/app/dashboard/integrations/[slug]/page.tsx",
    "utf8",
  );
  const list = readFileSync(
    "src/container/Dashboard/Markets/index.tsx",
    "utf8",
  );
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Markets"), true);
  assert.equal(detail.includes("MarketDetail"), true);
  assert.equal(list.includes('pageTitle="Integrations"'), true);
});

test("market connections persist dummy localStorage state", () => {
  const hook = readFileSync(
    "src/container/Dashboard/Markets/useMarketConnections.ts",
    "utf8",
  );
  const connect = readFileSync(
    "src/container/Dashboard/Markets/MarketDetail/ConnectStoreSlideout.tsx",
    "utf8",
  );
  assert.equal(hook.includes("writeMarketConnections"), true);
  assert.equal(hook.includes("updateMapped"), true);
  assert.equal(connect.includes("toMarketConnection"), true);
  assert.equal(connect.includes("bizexpertApi.post"), false);
});

test("market detail exposes webhook mapping and dummy orders", () => {
  const detail = readFileSync(
    "src/container/Dashboard/Markets/MarketDetail/index.tsx",
    "utf8",
  );
  const panel = readFileSync(
    "src/container/Dashboard/Markets/MarketDetail/ConnectionPanel.tsx",
    "utf8",
  );
  const mapProducts = readFileSync(
    "src/container/Dashboard/Markets/MarketDetail/MapProductsSlideout.tsx",
    "utf8",
  );
  assert.equal(detail.includes("remoteOrdersFor"), true);
  assert.equal(detail.includes("Connect store"), true);
  assert.equal(panel.includes("Copy webhook URL"), true);
  assert.equal(mapProducts.includes("Save mapping"), true);
});
