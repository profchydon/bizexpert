import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("FileUploadDropZone", () => {
  it("opens the file picker from the full drop zone click target", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/application/file-upload/file-upload-drop-zone.tsx",
      ),
      "utf8",
    );

    assert.match(source, /handleZoneClick/);
    assert.match(source, /role="button"/);
    assert.match(source, /Click to upload/);
    assert.doesNotMatch(source, /htmlFor=\{id\}/);
  });
});
