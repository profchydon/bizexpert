import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

import { equipmentHashCodeHref } from "./equipmentHashCodeHref";

describe("equipmentHashCodeHref", () => {
  it("returns absolute http(s) download urls", () => {
    assert.equal(
      equipmentHashCodeHref("https://files.example.com/hash.zip"),
      "https://files.example.com/hash.zip",
    );
    assert.equal(
      equipmentHashCodeHref("  http://localhost:3000/hash.zip  "),
      "http://localhost:3000/hash.zip",
    );
  });

  it("rejects missing, relative, and non-http schemes", () => {
    assert.equal(equipmentHashCodeHref(undefined), undefined);
    assert.equal(equipmentHashCodeHref(""), undefined);
    assert.equal(equipmentHashCodeHref("   "), undefined);
    assert.equal(equipmentHashCodeHref("/uploads/hash.zip"), undefined);
    assert.equal(equipmentHashCodeHref("javascript:alert(1)"), undefined);
    assert.equal(equipmentHashCodeHref("data:text/html,hi"), undefined);
  });
});

describe("hash code download wiring", () => {
  const content = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/EquipmentOtherDetailsContent.tsx",
    ),
    "utf8",
  );
  const documents = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/EquipmentAssociatedDocuments.tsx",
    ),
    "utf8",
  );
  const legacyDrawer = readFileSync(
    join(
      process.cwd(),
      "src/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/index.tsx",
    ),
    "utf8",
  );

  it("only binds href through the shared helper", () => {
    assert.match(content, /equipmentHashCodeHref\(equipment\.hash_code\)/);
    assert.doesNotMatch(content, /href=\{equipment\.hash_code\}/);
    assert.match(documents, /equipmentHashCodeHref\(hashCode\)/);
    assert.doesNotMatch(documents, /href=\{hashCode\}/);
    assert.match(legacyDrawer, /EquipmentAssociatedDocuments/);
    assert.doesNotMatch(legacyDrawer, /href=\{equipmentsData\?\.hash_code\}/);
    assert.match(content, /rel="noopener noreferrer"/);
    assert.match(documents, /rel="noopener noreferrer"/);
  });
});
