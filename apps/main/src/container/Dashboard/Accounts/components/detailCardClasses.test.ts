import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import {
  detailCardBodyClass,
  detailCardClass,
  detailCardLinkClass,
  detailRowClass,
} from "./detailCardClasses";

describe("detailCardClasses", () => {
  it("matches reference card shell without heavy shadow", () => {
    assert.match(
      detailCardClass,
      /rounded-xl border border-gray-200 bg-white p-5/,
    );
    assert.doesNotMatch(detailCardClass, /shadow/);
    assert.doesNotMatch(detailCardClass, /\bshadow-xs\b/);
    assert.match(detailCardBodyClass, /divide-y divide-gray-200/);
    assert.match(detailRowClass, /py-3/);
    assert.match(detailCardLinkClass, /text-sm font-semibold text-primary-700/);
  });
});

describe("DetailCard", () => {
  it("supports a footer action outside divided rows", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/DetailCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /footer\?: React.ReactNode/);
    assert.match(source, /detailCardBodyClass/);
  });
});

describe("SubsidiaryDetailPage offices card", () => {
  it("renders office previews in SubsidiaryOfficesCard", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryOfficesCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /detailCardLinkClass/);
    assert.match(source, /PREVIEW_COUNT/);
  });
});
