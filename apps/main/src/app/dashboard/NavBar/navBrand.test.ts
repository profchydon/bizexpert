import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("NavBrand uses BizExpert text for BizExpert", () => {
  const source = readFileSync("src/app/dashboard/NavBar/NavBrand.tsx", "utf8");
  assert.equal(source.includes("isBizExpertApp()"), true);
  assert.equal(source.includes("BizExpert"), true);
  assert.equal(source.includes("return null"), false);
});

test("BizExpert sidebar uses the text brand", () => {
  const sidebar = readFileSync(
    "src/components/bizexpert/BizExpertSidebar.tsx",
    "utf8",
  );
  assert.equal(sidebar.includes("<NavBrand"), true);
});
