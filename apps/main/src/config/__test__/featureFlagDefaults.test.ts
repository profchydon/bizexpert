import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const hook = readFileSync("src/hooks/useFeatureFlag.ts", "utf8");

function resolveEnabled(
  value: boolean | undefined,
  defaultEnabled: boolean,
): boolean {
  return defaultEnabled ? value !== false : value === true;
}

test("opt-in flags stay off unless posthog explicitly enables them", () => {
  assert.equal(resolveEnabled(undefined, false), false);
  assert.equal(resolveEnabled(false, false), false);
  assert.equal(resolveEnabled(true, false), true);
});

test("opt-out flags stay on unless posthog explicitly disables them", () => {
  assert.equal(resolveEnabled(undefined, true), true);
  assert.equal(resolveEnabled(true, true), true);
  assert.equal(resolveEnabled(false, true), false);
});

test("the hook implements exactly that resolution rule", () => {
  assert.match(
    hook,
    /enabled:\s*defaultEnabled \? value !== false : value === true/,
  );
});

test("the default stays opt-in so existing flags are unaffected", () => {
  assert.match(hook, /options\?\.defaultEnabled \?\? false/);
});

test("existing flag call sites pass no options and keep opt-in behaviour", () => {
  const callSites = [
    "src/app/dashboard/NavBar/NavSetting.tsx",
    "src/container/Dashboard/Settings/TaxJurisdictionCard.tsx",
    "src/components/AccountManagementRouteGuard.tsx",
  ];

  callSites.forEach((path) => {
    const source = readFileSync(path, "utf8");
    assert.equal(source.includes("defaultEnabled"), false, path);
  });
});
