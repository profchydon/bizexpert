import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCountryMetricLinks } from "./buildCountryMetricLinks";

test("buildCountryMetricLinks returns routes only for non-zero metrics", () => {
  const links = buildCountryMetricLinks({
    code: "NG",
    countryId: "country-1",
    name: "Nigeria",
    employees: 4,
    equipment: 0,
    storage: 2,
    catalogs: 0,
  });

  assert.equal(links.length, 2);
  assert.match(links[0].href ?? "", /employees/i);
  assert.match(links[1].href ?? "", /storage/i);
});
