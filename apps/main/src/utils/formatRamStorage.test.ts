import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatRamStorage } from "./formatRamStorage";

describe("formatRamStorage", () => {
  it("joins memory and storage with a slash when both exist", () => {
    assert.equal(
      formatRamStorage({ memory: "16GB", storage: "512 GB SSD" }),
      "16GB/512 GB SSD",
    );
  });

  it("returns memory only when storage is missing", () => {
    assert.equal(formatRamStorage({ memory: "16GB" }), "16GB");
  });

  it("returns storage only when memory is missing", () => {
    assert.equal(formatRamStorage({ storage: "512 GB SSD" }), "512 GB SSD");
  });

  it("returns NA when both memory and storage are missing", () => {
    assert.equal(formatRamStorage({}), "NA");
    assert.equal(formatRamStorage({ memory: "", storage: "   " }), "NA");
    assert.equal(formatRamStorage(undefined), "NA");
    assert.equal(formatRamStorage(null), "NA");
    assert.equal(formatRamStorage([]), "NA");
  });
});
