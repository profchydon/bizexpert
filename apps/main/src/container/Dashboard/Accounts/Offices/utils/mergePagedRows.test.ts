import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergePagedRows, syncOpenPagedRows } from "./mergePagedRows";

describe("mergePagedRows", () => {
  it("replaces rows when the first page arrives", () => {
    const merged = mergePagedRows(
      [{ id: "old" }],
      [{ id: "a" }, { id: "b" }],
      1,
    );
    assert.deepEqual(
      merged.map((row) => row.id),
      ["a", "b"],
    );
  });

  it("appends later pages after existing rows", () => {
    const merged = mergePagedRows([{ id: "a" }], [{ id: "b" }, { id: "c" }], 2);
    assert.deepEqual(
      merged.map((row) => row.id),
      ["a", "b", "c"],
    );
  });

  it("drops duplicate ids when appending", () => {
    const merged = mergePagedRows([{ id: "a" }], [{ id: "a" }, { id: "b" }], 2);
    assert.deepEqual(
      merged.map((row) => row.id),
      ["a", "b"],
    );
  });

  it("dedupes numeric and string ids consistently", () => {
    const merged = mergePagedRows([{ id: 1 }], [{ id: "1" }, { id: 2 }], 2);
    assert.deepEqual(
      merged.map((row) => String(row.id)),
      ["1", "2"],
    );
  });
});

describe("syncOpenPagedRows", () => {
  it("clears rows when the modal is closed", () => {
    assert.deepEqual(
      syncOpenPagedRows(false, [{ id: "a" }], [{ id: "b" }], 1),
      [],
    );
  });

  it("rehydrates from cached page one after the modal is closed", () => {
    assert.deepEqual(
      syncOpenPagedRows(true, [], [{ id: "a" }, { id: "b" }], 1),
      [{ id: "a" }, { id: "b" }],
    );
  });

  it("keeps current rows while cached data has not arrived yet", () => {
    assert.deepEqual(
      syncOpenPagedRows(true, [{ id: "a" }], undefined, undefined),
      [{ id: "a" }],
    );
  });
});
