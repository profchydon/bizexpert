import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { canSubmitAddDocument } from "./addDocumentForm";

describe("canSubmitAddDocument", () => {
  it("requires a name, file, and idle upload state", () => {
    const file = new File(["content"], "invoice.pdf", {
      type: "application/pdf",
    });

    assert.equal(canSubmitAddDocument("Invoice", file, false), true);
    assert.equal(canSubmitAddDocument("I", file, false), false);
    assert.equal(canSubmitAddDocument("Invoice", null, false), false);
    assert.equal(canSubmitAddDocument("Invoice", file, true), false);
  });
});

describe("Add document slideout", () => {
  it("uses the design-ui SlideoutMenu shell and base form controls", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDocuments/AddDocument.tsx",
      ),
      "utf8",
    );

    assert.match(source, /SlideoutMenu/);
    assert.match(source, /FileUpload\.DropZone/);
    assert.match(source, /form="add-document-form"/);
    assert.match(source, /canSubmitAddDocument/);
    assert.match(source, /form\.watch\("document_name"\)/);
    assert.doesNotMatch(source, /formState\.isValid/);
    assert.doesNotMatch(source, /DrawerRight/);
  });

  it("surfaces upload failures instead of swallowing them", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDocuments/AddDocument.tsx",
      ),
      "utf8",
    );

    assert.match(source, /await addEquipmentDocument\(payload\)\.unwrap\(\)/);
    assert.doesNotMatch(source, /\.catch\(\(\) => \{\}\)/);
    assert.match(source, /showApiError\(error\)/);
    assert.doesNotMatch(source, /displayErrorMessage\(title, description\)/);
  });
});
