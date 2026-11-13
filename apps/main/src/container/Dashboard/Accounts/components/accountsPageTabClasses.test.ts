import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  accountsPageTabTriggerClass,
  accountsPageTabsListClass,
} from "./accountsPageTabClasses";

describe("accounts page tab classes", () => {
  it("uses underline tabs aligned to the reference spacing", () => {
    assert.match(accountsPageTabsListClass, /gap-3/);
    assert.match(accountsPageTabsListClass, /before:h-px before:bg-gray-200/);
    assert.doesNotMatch(accountsPageTabsListClass, /border-b border-gray-200/);
    assert.match(accountsPageTabTriggerClass, /relative z-10/);
    assert.match(accountsPageTabTriggerClass, /px-1 pb-2\.5 pt-0/);
    assert.match(accountsPageTabTriggerClass, /hover:border-primary-700/);
    assert.match(
      accountsPageTabTriggerClass,
      /data-\[state=active\]:border-primary-700/,
    );
    assert.doesNotMatch(accountsPageTabTriggerClass, /-mb-px/);
  });
});
