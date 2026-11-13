import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mapEntityFootprint } from "./mapEntityFootprint";

describe("mapEntityFootprint", () => {
  it("maps employees_count and assets_count from the detail payload", () => {
    assert.deepEqual(
      mapEntityFootprint({ employees_count: 12, assets_count: 34 }),
      { employees: 12, assets: 34 },
    );
  });

  it("maps nested footprint counts from the detail payload", () => {
    assert.deepEqual(
      mapEntityFootprint({
        footprint: {
          scope: "entity",
          company_id: "01a01973-c039-71cf-8290-2aeed95faa66",
          employees: 1,
          assets: 0,
        },
      }),
      { employees: 1, assets: 0 },
    );
  });

  it("prefers nested footprint counts over legacy top-level fields", () => {
    assert.deepEqual(
      mapEntityFootprint({
        employees_count: 5,
        assets_count: 9,
        footprint: {
          employees: 1,
          assets: 0,
        },
      }),
      { employees: 1, assets: 0 },
    );
  });

  it("defaults missing counts to zero", () => {
    assert.deepEqual(mapEntityFootprint({}), { employees: 0, assets: 0 });
  });

  it("treats null counts as zero", () => {
    assert.deepEqual(
      mapEntityFootprint({ employees_count: null, assets_count: null }),
      { employees: 0, assets: 0 },
    );
  });
});
