import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("BizExpert dashboard uses a sidebar without a top nav menu", () => {
  const layout = readFileSync("src/app/dashboard/layout.tsx", "utf8");
  const frame = readFileSync(
    "src/components/bizexpert/BizExpertDashboardFrame.tsx",
    "utf8",
  );
  const sidebar = readFileSync(
    "src/components/bizexpert/BizExpertSidebar.tsx",
    "utf8",
  );
  const shell = layout.slice(
    layout.indexOf("function BizExpertDashboardShell"),
    layout.indexOf("function RaydaDashboardShell"),
  );
  assert.equal(shell.includes("BizExpertDashboardFrame"), true);
  assert.equal(shell.includes("NavBar"), false);
  assert.equal(frame.includes("bizExpertHeaderClass"), false);
  assert.equal(frame.includes("<header"), false);
  assert.equal(sidebar.includes("bizexpertNavIcon"), true);
  assert.equal(sidebar.includes("BizExpertSidebarGroup"), true);
  assert.equal(sidebar.includes("<NavBrand"), true);
});

test("BizExpert sidebar is a floating glass card", () => {
  const classes = readFileSync(
    "src/components/bizexpert/bizExpertSidebarClasses.ts",
    "utf8",
  );
  assert.equal(classes.includes("backdrop-blur-xl"), true);
  assert.equal(classes.includes("rounded-2xl"), true);
  assert.equal(classes.includes("bg-gray-950/80"), true);
  assert.equal(classes.includes("lg:pl-[19.5rem]"), true);
  assert.equal(classes.includes("px-5"), true);
});
