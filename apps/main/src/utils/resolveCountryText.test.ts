import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveCountryCode, resolveCountryText } from "./resolveCountryText";

describe("resolveCountryText", () => {
  it("returns string countries unchanged", () => {
    assert.equal(resolveCountryText("Nigeria"), "Nigeria");
  });

  it("reads nested country objects", () => {
    assert.equal(
      resolveCountryText({ name: "Nigeria", code: "NG" }),
      "Nigeria",
    );
  });
});

describe("resolveCountryCode", () => {
  it("prefers country_code and falls back to nested country.code", () => {
    assert.equal(resolveCountryCode("ng", null), "NG");
    assert.equal(resolveCountryCode(undefined, { code: "gh" }), "GH");
  });
});
