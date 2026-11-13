import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildEntitiesListParams } from "./buildEntitiesListParams";

describe("buildEntitiesListParams", () => {
  it("maps pagination, search, and status filters to API params", () => {
    assert.deepEqual(
      buildEntitiesListParams({
        page: 2,
        perPage: 15,
        search: "  acme  ",
        statuses: ["operational", "card-pending"],
      }),
      {
        page: 2,
        per_page: 15,
        search: "acme",
        status: "operational,card_pending",
      },
    );
  });

  it("omits empty search and status params", () => {
    assert.deepEqual(
      buildEntitiesListParams({
        page: 1,
        perPage: 15,
        search: "   ",
        statuses: [],
      }),
      {
        page: 1,
        per_page: 15,
      },
    );
  });

  it("does not send status when only N/A is selected", () => {
    assert.deepEqual(
      buildEntitiesListParams({
        page: 1,
        perPage: 15,
        statuses: ["N/A"],
      }),
      {
        page: 1,
        per_page: 15,
      },
    );
  });

  it("maps a single status filter to the API status param", () => {
    assert.deepEqual(
      buildEntitiesListParams({
        page: 1,
        perPage: 15,
        statuses: ["closed"],
      }),
      {
        page: 1,
        per_page: 15,
        status: "closed",
      },
    );
  });
});
