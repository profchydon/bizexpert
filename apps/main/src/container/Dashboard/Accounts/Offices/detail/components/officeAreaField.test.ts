import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const fieldSource = readFileSync(join(dir, "OfficeAreaField.tsx"), "utf8");
const modalSource = readFileSync(join(dir, "AddOfficeAssetModal.tsx"), "utf8");
const hookSource = readFileSync(
  join(dir, "../../hooks/useOfficeAreaCreate.ts"),
  "utf8",
);

describe("OfficeAreaField", () => {
  it("shows the add-area link only when the office has no areas", () => {
    assert.match(fieldSource, /\{areas\.length === 0 && \(/);
    assert.match(fieldSource, />\s*Add office area\s*</);
  });
});

describe("useOfficeAreaCreate", () => {
  it("creates the area under the office's own entity", () => {
    assert.match(hookSource, /companyId: office\.subsidiaryId/);
  });

  it("closes the area modal and auto-selects the created area", () => {
    const success = hookSource.slice(hookSource.indexOf(".unwrap()"));
    const closeAt = success.indexOf("setIsModalOpen(false)");
    const selectAt = success.indexOf("onSelect(area.id)");
    assert.ok(closeAt > -1);
    assert.ok(selectAt > closeAt);
  });

  it("keeps the created area selectable before the office refetch lands", () => {
    assert.match(hookSource, /\[\.\.\.areas, createdArea\]/);
  });
});

describe("AddOfficeAssetModal area flow", () => {
  it("hides the assets dialog while the area modal is open", () => {
    assert.match(modalSource, /open=\{isOpen && !areaCreate\.isModalOpen\}/);
  });

  it("renders the area modal outside the assets dialog", () => {
    const dialogEnd = modalSource.indexOf("</Dialog>");
    const areaModalAt = modalSource.indexOf("<OfficeAreaModal");
    assert.ok(dialogEnd > -1);
    assert.ok(areaModalAt > dialogEnd);
  });

  it("renders the area field with create-area support", () => {
    assert.match(modalSource, /<OfficeAreaField/);
    assert.match(modalSource, /onAddArea=\{areaCreate\.openModal\}/);
    assert.match(modalSource, /areas=\{areaCreate\.mergedAreas\}/);
  });
});
