import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("OrderInformationTable legacy shell", () => {
  it("uses reference table shell with full-bleed header for device_refresh orders", () => {
    const indexSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/OrderInformationTable/index.tsx",
      ),
      "utf8",
    );
    const headerSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Orders/ViewOrder/OrderInformationTable/OrderInformationTableHeader.tsx",
      ),
      "utf8",
    );

    assert.match(indexSource, /referenceTableShellClass/);
    assert.doesNotMatch(indexSource, /CardHeader/);
    assert.match(indexSource, /OrderInformationTableHeader/);
    assert.match(headerSource, /fullBleedBorderBottomSectionClass/);
  });
});
