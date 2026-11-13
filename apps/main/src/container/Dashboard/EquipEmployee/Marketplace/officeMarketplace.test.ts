import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  countryMatchesOfficeRegion,
  findCountryForOfficeRegion,
  marketplaceWithOffice,
  withOfficeQuery,
} from "./officeMarketplace";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const dir = "src/container/Dashboard/EquipEmployee/Marketplace";

describe("officeMarketplace", () => {
  it("matches an office region to a country by name or mapped code", () => {
    const uk = { id: "gb", name: "United Kingdom", code: "GB" };
    const us = { id: "us", name: "United States", code: "US" };
    assert.equal(countryMatchesOfficeRegion(uk, "United Kingdom"), true);
    assert.equal(countryMatchesOfficeRegion(us, "United Kingdom"), false);
    assert.deepEqual(
      findCountryForOfficeRegion([us, uk], "United Kingdom"),
      uk,
    );
  });

  it("keeps the office query on marketplace links", () => {
    const officeId = "01a106ea-f574-73d9-a815-290e526d18b9";
    assert.equal(
      marketplaceWithOffice(officeId),
      `/dashboard/equip-employee/marketplace?office=${officeId}`,
    );
    assert.equal(
      withOfficeQuery(
        "/dashboard/equip-employee/marketplace/asset-1?specId=spec-1",
        officeId,
      ),
      `/dashboard/equip-employee/marketplace/asset-1?specId=spec-1&office=${officeId}`,
    );
    assert.equal(
      withOfficeQuery(
        `/dashboard/equip-employee/marketplace?office=${officeId}`,
        officeId,
      ),
      `/dashboard/equip-employee/marketplace?office=${officeId}`,
    );
  });

  it("does not show the office keeps copy and still locks the catalog country", () => {
    const page = read(`${dir}/index.tsx`);
    const layout = read(`${dir}/ProductsLayout.tsx`);

    assert.doesNotMatch(page, /OfficeRecipientStrip/);
    assert.doesNotMatch(page, /The office keeps what you buy here/);
    assert.match(layout, /useOfficeMarketplaceCountry\(office, countries\)/);
    assert.match(layout, /withOfficeQuery\(/);
  });
});
