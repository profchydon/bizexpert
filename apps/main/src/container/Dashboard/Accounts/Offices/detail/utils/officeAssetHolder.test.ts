import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  officeAssetHolderKey,
  parseOfficeAssetHolder,
} from "./officeAssetHolder";

describe("officeAssetHolder", () => {
  it("round-trips a room and a person", () => {
    assert.deepEqual(
      parseOfficeAssetHolder(officeAssetHolderKey({ kind: "area", id: "a1" })),
      {
        kind: "area",
        id: "a1",
      },
    );
    assert.deepEqual(
      parseOfficeAssetHolder(
        officeAssetHolderKey({ kind: "employee", id: "e1" }),
      ),
      { kind: "employee", id: "e1" },
    );
  });

  it("rejects empty or unknown values", () => {
    assert.equal(parseOfficeAssetHolder(null), null);
    assert.equal(parseOfficeAssetHolder("area:"), null);
    assert.equal(parseOfficeAssetHolder("room-1"), null);
  });
});
