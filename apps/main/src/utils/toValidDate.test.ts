import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toValidDate } from "./toValidDate";

describe("toValidDate", () => {
  it("returns a valid Date for ISO strings and Date objects", () => {
    const date = new Date("2026-07-23T12:00:00.000Z");
    assert.ok(toValidDate("2026-07-23") instanceof Date);
    assert.equal(toValidDate(date), date);
  });

  it("returns undefined for empty or invalid values", () => {
    assert.equal(toValidDate(undefined), undefined);
    assert.equal(toValidDate(""), undefined);
    assert.equal(toValidDate("Invalid Date"), undefined);
    assert.equal(toValidDate("not-a-date"), undefined);
    assert.equal(toValidDate(new Date("invalid")), undefined);
  });
});
