import assert from "node:assert/strict";
import { test } from "node:test";

import {
  resolveAutocompleteControlLayout,
  resolveAutocompleteMultiValueLabelLayout,
  resolveAutocompleteMultiValueLayout,
  resolveAutocompleteValueContainerLayout,
} from "./autocompleteLayoutStyles";

const baseProvided = {
  minHeight: "38px",
  flexWrap: "wrap",
  overflow: "visible",
};

test("multi-select value container wraps chips without inner scroll", () => {
  const layout = resolveAutocompleteValueContainerLayout(true, baseProvided);

  assert.equal(layout.flexWrap, "wrap");
  assert.equal(layout.overflow, "visible");
  assert.equal(layout.maxHeight, undefined);
});

test("multi-select control scrolls when chips exceed max height", () => {
  const layout = resolveAutocompleteControlLayout(
    true,
    "default",
    baseProvided,
  );

  assert.equal(layout.maxHeight, "120px");
  assert.equal(layout.overflowY, "auto");
});

test("single-select value container keeps nowrap truncation", () => {
  const layout = resolveAutocompleteValueContainerLayout(false, baseProvided);

  assert.equal(layout.flexWrap, "nowrap");
  assert.equal(layout.overflow, "hidden");
  assert.equal(layout.maxHeight, undefined);
});

test("multi-select control grows with chip rows", () => {
  const layout = resolveAutocompleteControlLayout(
    true,
    "default",
    baseProvided,
  );

  assert.equal(layout.height, "auto");
  assert.equal(layout.minHeight, "44px");
});

test("single-select sm control keeps fixed height", () => {
  const layout = resolveAutocompleteControlLayout(false, "sm", baseProvided);

  assert.equal(layout.height, "36px");
  assert.equal(layout.minHeight, "36px");
});

test("multi-value chips do not shrink and labels truncate", () => {
  const chip = resolveAutocompleteMultiValueLayout({ flexShrink: 1 });
  const label = resolveAutocompleteMultiValueLabelLayout({ maxWidth: "100%" });

  assert.equal(chip.display, "inline-flex");
  assert.equal(chip.flexWrap, "nowrap");
  assert.equal(label.flexShrink, 0);
  assert.equal(label.textOverflow, "ellipsis");
  assert.equal(label.maxWidth, "180px");
});
