import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  fullBleedBorderBottomSectionClass,
  fullBleedBorderTopSectionClass,
} from "./fullBleedDividerClasses";

describe("fullBleedDividerClasses", () => {
  it("exports edge-to-edge border section classes", () => {
    assert.match(
      fullBleedBorderBottomSectionClass,
      /border-b border-border-secondary/,
    );
    assert.match(
      fullBleedBorderTopSectionClass,
      /border-t border-border-secondary/,
    );
  });
});

describe("Order information table dividers", () => {
  it("uses full-bleed header and pagination section borders", () => {
    const header = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/v2/table/OrderInfoTableHeader.tsx",
      ),
      "utf8",
    );
    const pagination = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/v2/table/OrderInfoTablePagination.tsx",
      ),
      "utf8",
    );

    assert.match(header, /fullBleedBorderBottomSectionClass/);
    assert.doesNotMatch(header, /h-px w-full bg-border-secondary/);
    assert.match(pagination, /fullBleedBorderTopSectionClass/);
    assert.doesNotMatch(pagination, /h-px w-full bg-border-secondary/);
  });
});

describe("Cart overview totals dividers", () => {
  it("uses full-bleed border sections instead of h-px rows", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/Drawers/CartOverview/index.tsx"),
      "utf8",
    );

    assert.match(source, /border-t border-gray-200/);
    assert.match(source, /border-b border-gray-200 px-6 pb-4 pt-5/);
    assert.doesNotMatch(source, /h-px w-full bg-gray-200/);
  });
});
