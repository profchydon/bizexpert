import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toOfficeParent } from "./buildOffice";
import { subsidiariesSeed } from "../../data/subsidiariesSeed";

describe("toOfficeParent", () => {
  it("maps a subsidiary to a wizard parent option", () => {
    const subsidiary = subsidiariesSeed[0]!;
    const parent = toOfficeParent(subsidiary);

    assert.equal(parent.id, subsidiary.id);
    assert.equal(parent.name, subsidiary.name);
    assert.equal(parent.region, subsidiary.region);
    assert.equal(parent.currency, subsidiary.currency);
    assert.equal(parent.officesCount, subsidiary.officesCount);
  });
});
