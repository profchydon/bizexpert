import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { specSuggestions } from "./specSuggestions";
import { specTypeOptions } from "./specTypes";

describe("master catalog spec presets", () => {
  it("includes the core preset spec keys from master catalog", () => {
    const values = specTypeOptions.map((option) => option.value);

    assert.ok(values.includes("condition"));
    assert.ok(values.includes("processor"));
    assert.ok(values.includes("screen-size"));
    assert.ok(values.includes("keyboard"));
    assert.equal(new Set(values).size, values.length);
  });

  it("provides preset value suggestions for common specs", () => {
    assert.ok(specSuggestions("condition").length >= 4);
    assert.ok(
      specSuggestions("processor").some((item) => item.label.includes("M3")),
    );
    assert.ok(
      specSuggestions("ram").some((item) => item.label.includes("16GB")),
    );
  });
});
