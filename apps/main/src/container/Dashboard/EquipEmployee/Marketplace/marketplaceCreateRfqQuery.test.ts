import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  clearMarketplaceCreateRfqQueryHref,
  marketplaceCreateRfqCountryFromQuery,
  shouldOpenMarketplaceCreateRfq,
} from "./marketplaceCreateRfqQuery";

describe("marketplaceCreateRfqQuery", () => {
  it("detects when the create RFQ modal should open", () => {
    assert.equal(
      shouldOpenMarketplaceCreateRfq(new URLSearchParams("create_rfq=true")),
      true,
    );
    assert.equal(
      shouldOpenMarketplaceCreateRfq(new URLSearchParams("create_rfq=false")),
      false,
    );
  });

  it("parses country details from the query string", () => {
    assert.deepEqual(
      marketplaceCreateRfqCountryFromQuery(
        new URLSearchParams(
          "create_rfq=true&country_id=country-ng&country_name=Nigeria&country_code=NG",
        ),
      ),
      {
        id: "country-ng",
        name: "Nigeria",
        code: "NG",
      },
    );
  });

  it("clears create RFQ query params from the href", () => {
    assert.equal(
      clearMarketplaceCreateRfqQueryHref(
        "/dashboard/equip-employee/marketplace",
        new URLSearchParams(
          "create_rfq=true&country_id=country-ng&country_name=Nigeria&country_code=NG&extra_items=true",
        ),
      ),
      "/dashboard/equip-employee/marketplace?extra_items=true",
    );
  });
});
