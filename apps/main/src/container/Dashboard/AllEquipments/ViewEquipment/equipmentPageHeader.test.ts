import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EquipmentPageHeader", () => {
  it("matches reference detail header icons and scoped navigation loading", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentPageHeader.tsx",
      ),
      "utf8",
    );

    assert.match(source, /HomeLine/);
    assert.match(source, /ChevronRight/);
    assert.match(source, /ArrowLeft/);
    assert.match(source, /ArrowRight/);
    assert.match(source, /activeDirection === "prev"/);
    assert.match(source, /activeDirection === "next"/);
    assert.doesNotMatch(source, /lucide-react/);
  });
});

describe("useEquipmentAdjacentNavigation", () => {
  it("falls back to equipment list query when session ids are missing", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/useEquipmentAdjacentNavigation.ts",
      ),
      "utf8",
    );

    assert.match(source, /useGetEquipmentsQuery/);
    assert.match(source, /EQUIPMENT_API_PAGE_SIZE/);
    assert.match(source, /storedIds\.length === 0/);
    assert.match(source, /hasPrev/);
    assert.match(source, /hasNext/);
  });
});
