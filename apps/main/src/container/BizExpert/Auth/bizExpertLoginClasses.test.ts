import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  bizExpertLoginCardClass,
  bizExpertLoginPageClass,
  bizExpertLoginPanelClass,
} from "./bizExpertLoginClasses";
import { bizExpertLoginHighlights } from "./bizExpertLoginHighlights";

test("BizExpert login uses a branded split without the Rayda banner", () => {
  const page = readFileSync(
    "src/container/BizExpert/Auth/BizExpertLogin.tsx",
    "utf8",
  );
  const panel = readFileSync(
    "src/container/BizExpert/Auth/BizExpertLoginPanel.tsx",
    "utf8",
  );
  assert.equal(page.includes("loginBanner"), false);
  assert.equal(page.includes("next/image"), false);
  assert.equal(page.includes("BizExpertLoginPanel"), true);
  assert.equal(page.includes("BizExpert"), true);
  assert.equal(panel.includes("loginBanner"), false);
  assert.equal(panel.includes("rayda_logo"), false);
  assert.equal(panel.includes("BizExpert"), true);
});

test("BizExpert login layout is a dark panel plus a light form card", () => {
  assert.equal(bizExpertLoginPageClass.includes("bg-gray-50"), true);
  assert.equal(bizExpertLoginPanelClass.includes("bg-gray-950"), true);
  assert.equal(bizExpertLoginPanelClass.includes("hidden"), true);
  assert.equal(bizExpertLoginPanelClass.includes("lg:flex"), true);
  assert.equal(bizExpertLoginCardClass.includes("rounded-2xl"), true);
  assert.equal(bizExpertLoginCardClass.includes("border-gray-200"), true);
});

test("BizExpert login highlights stores stock and sales", () => {
  assert.deepEqual(
    bizExpertLoginHighlights.map((item) => item.id),
    ["stores", "stock", "sales"],
  );
});
