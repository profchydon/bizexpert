import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { COST_CENTRE_SCROLL_ROW_LIMIT } from "./detailCardClasses";

const dir = dirname(fileURLToPath(import.meta.url));

describe("SubsidiaryCostCentreCard scroll", () => {
  it("scrolls entity rows while keeping the total pinned below", () => {
    const cardSource = readFileSync(
      join(dir, "SubsidiaryCostCentreCard.tsx"),
      "utf8",
    );
    const classSource = readFileSync(join(dir, "detailCardClasses.ts"), "utf8");

    assert.match(cardSource, /costCentreSpendListScrollClass/);
    assert.match(cardSource, /costCentreSpendTotalClass/);
    assert.match(cardSource, /COST_CENTRE_SCROLL_ROW_LIMIT/);
    assert.match(classSource, /max-h-\[17\.5rem\]/);
    assert.match(classSource, /overflow-y-auto/);
    assert.doesNotMatch(
      cardSource,
      /Total this month[\s\S]*costCentreSpendListScrollClass/,
    );
  });

  it("shows entity count in the description", () => {
    const cardSource = readFileSync(
      join(dir, "SubsidiaryCostCentreCard.tsx"),
      "utf8",
    );

    assert.match(cardSource, /entityCountLabel/);
    assert.match(cardSource, /billed through/);
    assert.doesNotMatch(cardSource, /return "—"/);
  });
});

describe("detailCardClasses cost-centre spend", () => {
  it("uses a subtle scrollbar and fade when the list overflows", () => {
    const source = readFileSync(join(dir, "detailCardClasses.ts"), "utf8");

    assert.equal(COST_CENTRE_SCROLL_ROW_LIMIT, 5);
    assert.match(source, /overscroll-contain/);
    assert.match(source, /scrollbar-width:thin/);
    assert.match(source, /bg-gray-300/);
    assert.match(source, /mask-image:linear-gradient/);
    assert.match(source, /border-t border-gray-200/);
  });
});
