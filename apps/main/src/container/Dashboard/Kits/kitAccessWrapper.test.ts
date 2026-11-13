import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("kit access wrapper uses catalog_limit and the Manage upgrade prompt", () => {
  const wrapper = readFileSync(
    "src/container/Dashboard/Kits/KitAccessWrapper.tsx",
    "utf8",
  );
  const prompt = readFileSync(
    "src/container/Dashboard/Settings/Subscription/PlanUpgradePrompt.tsx",
    "utf8",
  );
  const layout = readFileSync("src/app/dashboard/kits/layout.tsx", "utf8");

  assert.match(wrapper, /useEntitlementOn\("catalog_limit"\)/);
  assert.match(wrapper, /PlanUpgradePrompt/);
  assert.match(wrapper, /Kits are on Manage and above/);
  assert.match(wrapper, /eyebrow="Kits"/);
  assert.match(prompt, /useTransitionRouter/);
  assert.match(prompt, /isLoading=\{isPending\}/);
  assert.match(layout, /KitAccessWrapper/);
});

test("kit library still opens Create Kit only after the layout gate", () => {
  const library = readFileSync(
    "src/container/Dashboard/Kits/KitLibraryPage.tsx",
    "utf8",
  );
  const dialog = readFileSync(
    "src/container/Dashboard/Kits/components/CreateKitDialog.tsx",
    "utf8",
  );

  assert.match(library, /CreateKitDialog/);
  assert.match(library, /setCreateOpen/);
  assert.doesNotMatch(library, /useEntitlementOn/);
  assert.doesNotMatch(dialog, /PlanUpgradePrompt/);
});
