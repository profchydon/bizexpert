import assert from "node:assert/strict";
import { test } from "node:test";
import {
  overviewDataTableProps,
  overviewMobileDataTableProps,
  overviewSectionDescriptionClass,
  overviewSectionHeadingClass,
} from "./overviewTableClasses";

test("overview tables use design-ui secondary surfaces and light dividers", () => {
  assert.match(overviewDataTableProps.headerClassName, /bg-secondary/);
  assert.match(
    overviewDataTableProps.headerCellClassName,
    /bg-border-secondary/,
  );
  assert.match(overviewDataTableProps.rowClassName, /bg-border-secondary/);
  assert.match(overviewDataTableProps.rowClassName, /hover:bg-secondary/);
  assert.doesNotMatch(overviewDataTableProps.headerClassName, /gray-/);
});

test("overview mobile tables keep the same styling with a fluid min width", () => {
  assert.equal(overviewMobileDataTableProps.tableClassName, "min-w-0");
  assert.equal(
    overviewMobileDataTableProps.headerClassName,
    overviewDataTableProps.headerClassName,
  );
});

test("overview section headings use semantic text tokens", () => {
  assert.match(overviewSectionHeadingClass, /text-primary/);
  assert.match(overviewSectionDescriptionClass, /text-tertiary/);
});
