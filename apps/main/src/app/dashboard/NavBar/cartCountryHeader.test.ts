import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { flagByCode } from "./flagByCode";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const scanImgFiles = [
  "src/app/dashboard/NavBar/CartCountryHeader.tsx",
  "src/components/application/device-check/CheckPhotoGrid.tsx",
  "src/container/Dashboard/Orders/ViewOrder/v2/OrderContentsV2.tsx",
  "src/container/Dashboard/Orders/ViewOrder/v2/OffboardContentsV2.tsx",
  "src/container/Dashboard/Catalogs/EmployeesRequest/ViewEmployeeDetails.tsx",
  "src/container/Dashboard/Overview/WhatsHappening/RecentPendingCatalogRequests/ViewEmployeeDetails.tsx",
];

describe("flagByCode", () => {
  it("resolves a two-letter country code to a flag component", () => {
    assert.ok(flagByCode("NG"));
    assert.equal(flagByCode("ng"), flagByCode("NG"));
    assert.equal(flagByCode(""), undefined);
    assert.equal(flagByCode("X"), undefined);
  });
});

describe("scan raw img replacements", () => {
  it("uses local flags in the cart country header", () => {
    const source = read("src/app/dashboard/NavBar/CartCountryHeader.tsx");
    assert.match(source, /flagByCode/);
    assert.doesNotMatch(source, /<img\b/);
    assert.doesNotMatch(source, /untitledui\.com\/images\/flags/);
    assert.doesNotMatch(source, /no-img-element/);
  });

  it("uses SafeImage instead of raw img on the scanned surfaces", () => {
    for (const path of scanImgFiles.slice(1)) {
      const source = read(path);
      assert.match(source, /SafeImage/, path);
      assert.doesNotMatch(source, /<img\b/);
      assert.doesNotMatch(source, /no-img-element/);
    }
  });
});
