import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildInStorageSelectedExportBody } from "./buildInStorageSelectedExportBody";
import { parseStorageExportErrorBlob } from "./parseStorageExportErrorBlob";

describe("buildInStorageSelectedExportBody", () => {
  it("returns an encrypted payload string instead of raw JSON", () => {
    process.env.NEXT_PUBLIC_ENCRYPT_KEY =
      process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "dGVzdC1lbmNyeXB0LWtleQ==";

    const encrypted = buildInStorageSelectedExportBody([
      "019f8bac-4110-70dc-82c8-84fe66b8e553",
    ]);

    assert.equal(typeof encrypted, "string");
    assert.notEqual(
      encrypted,
      JSON.stringify({
        equipment_ids: ["019f8bac-4110-70dc-82c8-84fe66b8e553"],
      }),
    );
    assert.match(encrypted, /^[A-Za-z0-9+/=]+$/);
  });
});

describe("parseStorageExportErrorBlob", () => {
  it("reads the API message from a JSON error blob", async () => {
    const blob = new Blob(
      [JSON.stringify({ success: false, message: "The payload is invalid." })],
      { type: "application/json" },
    );

    assert.equal(
      await parseStorageExportErrorBlob(blob),
      "The payload is invalid.",
    );
  });

  it("returns null when the blob is not JSON", async () => {
    const blob = new Blob(["not-json"], { type: "text/plain" });
    assert.equal(await parseStorageExportErrorBlob(blob), null);
  });
});
