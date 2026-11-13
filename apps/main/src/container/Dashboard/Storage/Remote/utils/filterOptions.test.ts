import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countryItems } from "./filterOptions";
import { flagByCode } from "@/app/dashboard/NavBar/flagByCode";

describe("countryItems", () => {
  it("attaches a flag icon for every inventory country including Afghanistan", () => {
    const items = countryItems([
      { id: "af", name: "Afghanistan", code: "AF" },
      { id: "ng", name: "Nigeria", code: "NG" },
    ]);

    assert.equal(items[0]?.label, "All countries");
    assert.equal(items[1]?.icon, flagByCode("AF"));
    assert.equal(items[2]?.icon, flagByCode("NG"));
    assert.ok(items[1]?.icon);
  });
});
