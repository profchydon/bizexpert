import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("ReferenceOrderItemSlideout", () => {
  it("uses DrawerRight in-flow footer and full-bleed item dividers", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/OrderDetailItem/ReferenceOrderItemSlideout.tsx",
      ),
      "utf8",
    );
    const content = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/OrderDetailItem/ReferenceItemContent.tsx",
      ),
      "utf8",
    );

    assert.match(slideout, /addSecondaryButton=/);
    assert.match(slideout, /cancelText="Cancel"/);
    assert.doesNotMatch(slideout, /hideDefaultFooterBtn/);
    assert.doesNotMatch(slideout, /fixed bottom-0 left-0 right-0/);
    assert.match(content, /fullBleedBorderBottomSectionClass/);
    assert.doesNotMatch(content, /h-px w-full bg-gray-200/);
    assert.doesNotMatch(content, /pb-28/);
  });

  it("renders SubOrderCancelModal outside the drawer so it stacks above", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/OrderDetailItem/ReferenceOrderItemSlideout.tsx",
      ),
      "utf8",
    );

    assert.match(slideout, /<>\s*\n\s*<DrawerRight/);
    assert.match(slideout, /<\/DrawerRight>\s*\n\s*<SubOrderCancelModal/);
  });
});

describe("OrderInformationTable item drawer", () => {
  it("opens ReferenceOrderItemSlideout instead of legacy OrderDetailItem", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/OrderInformationTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(source, /<ReferenceOrderItemSlideout/);
    assert.doesNotMatch(source, /import OrderDetailItem from/);
  });
});
