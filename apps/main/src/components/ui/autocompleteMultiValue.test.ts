import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildAutocompleteEmployeeLabel,
  mapEmployeesToAutocompleteOptions,
  normalizeMultiSelectValue,
} from "./autocompleteMultiValue";

test("buildAutocompleteEmployeeLabel falls back to email then id", () => {
  assert.equal(
    buildAutocompleteEmployeeLabel({
      id: "emp-12345678",
      first_name: "",
      last_name: "",
      email: "state.one@example.com",
    }),
    "state.one@example.com",
  );

  assert.equal(
    buildAutocompleteEmployeeLabel({
      id: "emp-12345678",
      first_name: "",
      last_name: "",
      email: "",
    }),
    "Employee emp-1234",
  );
});

test("mapEmployeesToAutocompleteOptions skips blank labels and duplicates", () => {
  const options = mapEmployeesToAutocompleteOptions([
    { id: "1", first_name: "State", last_name: "One" },
    { id: "1", first_name: "Duplicate", last_name: "Row" },
    { id: "2", first_name: "", last_name: "", email: "" },
    { id: "3", first_name: "Kingdom", last_name: "Two" },
  ]);

  assert.deepEqual(options, [
    { value: "1", label: "State One" },
    { value: "2", label: "Employee 2" },
    { value: "3", label: "Kingdom Two" },
  ]);
});

test("normalizeMultiSelectValue dedupes and drops empty labels", () => {
  const options = [
    { value: "1", label: "State One" },
    { value: "2", label: "Kingdom Two" },
  ];

  assert.deepEqual(
    normalizeMultiSelectValue(
      [
        { value: "1", label: "State One" },
        { value: "1", label: "State One" },
        { value: "2", label: "" },
        { value: "3", label: "Ghost" },
      ],
      options,
    ),
    [
      { value: "1", label: "State One", icon: undefined },
      { value: "2", label: "Kingdom Two", icon: undefined },
      { value: "3", label: "Ghost", icon: undefined },
    ],
  );
});
