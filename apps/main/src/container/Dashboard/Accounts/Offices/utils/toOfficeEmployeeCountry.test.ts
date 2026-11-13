import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toOfficeEmployee } from "./mapOfficeMembers";

describe("toOfficeEmployee country", () => {
  it("maps a nested country object to the country name", () => {
    const mapped = toOfficeEmployee({
      id: "e-1",
      first_name: "Ada",
      last_name: "Obi",
      email: "ada@example.com",
      country: {
        id: "ng",
        name: "Nigeria",
        code: "NG",
        currency_code: "NGN",
      },
    } as never);

    assert.equal(mapped.country, "Nigeria");
  });
});
