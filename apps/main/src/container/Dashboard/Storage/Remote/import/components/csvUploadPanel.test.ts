import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const importDir = join(
  process.cwd(),
  "src/container/Dashboard/Storage/Remote/import/components",
);

describe("CsvUploadPanel drop zone", () => {
  it("opens the file picker from the full drop zone click target", () => {
    const panel = readFileSync(join(importDir, "CsvUploadPanel.tsx"), "utf8");
    const dropZone = readFileSync(
      join(
        process.cwd(),
        "src/components/application/file-upload/file-upload-drop-zone.tsx",
      ),
      "utf8",
    );

    assert.match(
      panel,
      /from "@\/components\/application\/file-upload\/file-upload-drop-zone"/,
    );
    assert.match(panel, /FileUpload\.DropZone/);
    assert.match(panel, /FileListItemProgressBar/);
    assert.doesNotMatch(panel, /htmlFor=\{id\}/);
    assert.doesNotMatch(panel, /file-upload-base-button/);
    assert.match(dropZone, /handleZoneClick/);
    assert.match(dropZone, /role="button"/);
  });
});
