import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isRestrictedSpecKey,
  specSuggestions,
  specTypeLabel,
} from "./specSuggestions";

describe("specSuggestions", () => {
  it("labels known and unknown spec keys", () => {
    assert.equal(specTypeLabel("processor"), "Processor");
    assert.equal(specTypeLabel("ram"), "RAM");
    assert.equal(specTypeLabel("memory"), "Memory");
    assert.equal(specTypeLabel(""), "");
  });

  it("restricts keyboard and power adapter to fixed values", () => {
    assert.equal(isRestrictedSpecKey("keyboard"), true);
    assert.equal(isRestrictedSpecKey("power_adapter"), true);
    assert.equal(isRestrictedSpecKey("processor"), false);
    assert.equal(isRestrictedSpecKey("condition"), false);
  });

  it("suggests free-text values for processor", () => {
    assert.ok(
      specSuggestions("processor").some((item) => item.label === "Apple M1"),
    );
  });
});
