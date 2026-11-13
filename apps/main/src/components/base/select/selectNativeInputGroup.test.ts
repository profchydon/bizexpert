import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("NativeSelect inside InputGroup", () => {
  it("insets the chevron for md groups the same way it does for sm", () => {
    const nativeSelect = read("src/components/base/select/select-native.tsx");

    assert.match(
      nativeSelect,
      /in-data-input-wrapper:in-data-trailing:in-data-\[input-size=sm\]:right-3\b/,
    );
    assert.match(
      nativeSelect,
      /in-data-input-wrapper:in-data-trailing:in-data-\[input-size=md\]:right-3\.5/,
    );
  });

  it("shows focus on the whole group instead of ringing the select alone", () => {
    const nativeSelect = read("src/components/base/select/select-native.tsx");
    const inputGroup = read("src/components/base/input/input-group.tsx");

    assert.match(nativeSelect, /in-data-input-wrapper:focus-visible:ring-0/);
    assert.match(
      inputGroup,
      /has-\[&>select\]:has-\[select:focus-visible\]:ring-2/,
    );
    assert.match(
      inputGroup,
      /has-\[&>select\]:has-\[select:focus-visible\]:ring-border-brand/,
    );
  });
});
