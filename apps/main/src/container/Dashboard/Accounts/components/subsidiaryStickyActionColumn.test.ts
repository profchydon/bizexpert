import assert from "node:assert/strict";
import { test } from "node:test";
import {
  subsidiaryStickyActionCellClass,
  subsidiaryStickyActionHeadClass,
  subsidiaryTableHeadClass,
} from "./subsidiaryStickyActionColumn";

test("subsidiary sticky action column uses secondary surfaces without shadow", () => {
  assert.match(subsidiaryStickyActionHeadClass, /sticky right-0/);
  assert.match(subsidiaryStickyActionHeadClass, /bg-secondary/);
  assert.match(subsidiaryStickyActionCellClass, /group-hover:bg-secondary/);
  assert.doesNotMatch(subsidiaryStickyActionHeadClass, /shadow/);
  assert.doesNotMatch(subsidiaryStickyActionCellClass, /shadow/);
});

test("subsidiary table head uses reference spacing and header surface", () => {
  assert.match(subsidiaryTableHeadClass, /px-6 py-2/);
  assert.match(subsidiaryTableHeadClass, /bg-secondary/);
});
