import { strict as assert } from "node:assert";
import { test } from "node:test";
import { isDeviceCount, nextDeviceCount } from "./deviceCount";

test("device count keeps digits from 1 through 100000", () => {
  assert.equal(nextDeviceCount("", "27"), "27");
  assert.equal(nextDeviceCount("12", "12a"), "12");
  assert.equal(nextDeviceCount("", "-4"), "4");
  assert.equal(nextDeviceCount("99", "100000"), "100000");
  assert.equal(nextDeviceCount("100000", "1000001"), "100000");
});

test("device count rejects zero, blanks, and leading zeros", () => {
  assert.equal(nextDeviceCount("", "0"), "");
  assert.equal(nextDeviceCount("8", "0"), "");
  assert.equal(nextDeviceCount("", "000"), "");
  assert.equal(nextDeviceCount("", "007"), "7");
  assert.equal(nextDeviceCount("4", ""), "");
});

test("a saved count is valid only inside the api range", () => {
  assert.equal(isDeviceCount("1"), true);
  assert.equal(isDeviceCount("100000"), true);
  assert.equal(isDeviceCount("0"), false);
  assert.equal(isDeviceCount(""), false);
  assert.equal(isDeviceCount("-1"), false);
  assert.equal(isDeviceCount("100001"), false);
  assert.equal(isDeviceCount("1.5"), false);
});
