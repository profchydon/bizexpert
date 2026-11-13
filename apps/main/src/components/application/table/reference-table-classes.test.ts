import assert from "node:assert/strict";
import { test } from "node:test";
import {
  referenceDataTableProps,
  referenceNativeBodyRowClass,
  referenceNativeHeadRowClass,
  referenceTableCardHeaderDividerClass,
  referenceTableHeaderClass,
  referenceTableRowClass,
} from "./reference-table-classes";

test("reference DataTable props use secondary headers and light row dividers", () => {
  assert.match(referenceDataTableProps.headerClassName, /bg-secondary/);
  assert.match(
    referenceDataTableProps.headerCellClassName,
    /bg-border-secondary/,
  );
  assert.match(referenceDataTableProps.rowClassName, /bg-border-secondary/);
  assert.match(referenceDataTableProps.rowClassName, /hover:bg-secondary/);
  assert.doesNotMatch(referenceDataTableProps.headerClassName, /gray-/);
});

test("reference native table classes mirror the DataTable divider pattern", () => {
  assert.match(referenceNativeHeadRowClass, /bg-secondary/);
  assert.match(referenceNativeBodyRowClass, /bg-border-secondary/);
});

test("reference table header removes legacy border-b on rows", () => {
  assert.match(referenceTableHeaderClass, /\[&_tr\]:border-0/);
  assert.match(referenceTableRowClass, /border-0/);
});

test("reference table card header divider uses light border token", () => {
  assert.equal(
    referenceTableCardHeaderDividerClass,
    "border-b border-border-secondary",
  );
});
