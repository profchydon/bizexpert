import assert from "node:assert/strict";
import test from "node:test";
import { formatOfficeMoney } from "./officeFormat";

test("formatOfficeMoney uses currency symbols", () => {
  assert.equal(formatOfficeMoney(3840, "USD"), "$3,840");
  assert.equal(formatOfficeMoney(1200, "GBP"), "£1,200");
});
