import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import {
  primaryBadgeClass,
  primaryBadgeIconClass,
  primaryBadgeMdClass,
  primaryBadgeMdIconClass,
} from "./primaryBadgeClasses";

describe("primaryBadgeClasses", () => {
  it("matches the reference brand pill with inset ring and asymmetric padding", () => {
    assert.match(primaryBadgeClass, /bg-primary-50/);
    assert.match(primaryBadgeClass, /text-primary-700/);
    assert.match(primaryBadgeClass, /ring-1 ring-inset ring-primary-200/);
    assert.match(primaryBadgeClass, /pl-1\.5 pr-2/);
    assert.match(primaryBadgeClass, /gap-0\.5/);
    assert.match(primaryBadgeMdClass, /pl-2 pr-2\.5 text-sm/);
    assert.match(primaryBadgeIconClass, /size-3/);
    assert.match(primaryBadgeMdIconClass, /size-3\.5/);
    assert.match(primaryBadgeIconClass, /stroke-\[2\.5\]/);
  });
});

describe("PrimaryBadge", () => {
  it("renders the outlined star and label without BadgeWithIcon", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/PrimaryBadge.tsx",
      ),
      "utf8",
    );

    assert.match(source, /primaryBadgeIconClass/);
    assert.match(source, /primaryBadgeMdIconClass/);
    assert.match(source, /<Star/);
    assert.doesNotMatch(source, /BadgeWithIcon/);
  });
});
