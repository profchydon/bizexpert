import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeEntityFootprint,
  employeeBelongsToEntity,
  equipmentBelongsToEntity,
} from "./entityFootprint";
import { resolveEntityOffice } from "./resolveEntityOffice";

describe("resolveEntityOffice", () => {
  it("maps a direct entity region to that subsidiary", () => {
    const ref = resolveEntityOffice("United Kingdom", "emp-1");
    assert.equal(ref.entityId, "sub-uk");
    assert.equal(ref.entityName, "Acme UK Ltd");
  });

  it("rolls mapped countries up to the regional entity", () => {
    const ref = resolveEntityOffice("Ireland", "emp-2");
    assert.equal(ref.entityId, "sub-uk");
  });

  it("falls back to the primary entity for unknown countries", () => {
    const ref = resolveEntityOffice("Unknown Country", "emp-3");
    assert.equal(ref.entityId, "sub-hq");
  });
});

describe("computeEntityFootprint", () => {
  it("counts employees and assets for the matching entity", () => {
    const footprint = computeEntityFootprint(
      "sub-uk",
      [
        {
          id: "e-1",
          first_name: "A",
          last_name: "B",
          country: "United Kingdom",
        } as never,
        {
          id: "e-2",
          first_name: "C",
          last_name: "D",
          country: "United States",
        } as never,
      ],
      [
        { id: "a-1", country: "United Kingdom", status: "Assigned" } as never,
        { id: "a-2", country: "United Kingdom", status: "archived" } as never,
      ],
    );

    assert.equal(footprint.employees, 1);
    assert.equal(footprint.assets, 1);
  });

  it("matches employees via the same resolver used for filtering", () => {
    const employee = {
      id: "e-3",
      first_name: "E",
      last_name: "F",
      country: "Germany",
    } as never;

    assert.equal(employeeBelongsToEntity(employee, "sub-de"), true);
    assert.equal(
      employeeBelongsToEntity(
        {
          id: "e-4",
          first_name: "G",
          last_name: "H",
          country: { name: "Germany", code: "DE" },
        } as never,
        "sub-de",
      ),
      true,
    );
    assert.equal(
      equipmentBelongsToEntity(
        { id: "x", country: "Germany", status: "Unassigned" } as never,
        "sub-de",
      ),
      true,
    );
  });
});
