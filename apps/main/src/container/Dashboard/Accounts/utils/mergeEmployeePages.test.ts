import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeEmployeePages } from "./mergeEmployeePages";

describe("mergeEmployeePages", () => {
  it("replaces the list on the first page", () => {
    const firstPage = [{ id: "1", first_name: "Amara", last_name: "Okafor" }];
    const secondPage = [{ id: "2", first_name: "Liam", last_name: "Bennett" }];

    assert.deepEqual(mergeEmployeePages([], firstPage, 1), firstPage);
    assert.deepEqual(mergeEmployeePages(firstPage, secondPage, 1), secondPage);
  });

  it("appends later pages without duplicates", () => {
    const firstPage = [{ id: "1", first_name: "Amara", last_name: "Okafor" }];
    const secondPage = [
      { id: "1", first_name: "Amara", last_name: "Okafor" },
      { id: "2", first_name: "Liam", last_name: "Bennett" },
    ];

    assert.deepEqual(mergeEmployeePages(firstPage, secondPage, 2), [
      { id: "1", first_name: "Amara", last_name: "Okafor" },
      { id: "2", first_name: "Liam", last_name: "Bennett" },
    ]);
  });
});
