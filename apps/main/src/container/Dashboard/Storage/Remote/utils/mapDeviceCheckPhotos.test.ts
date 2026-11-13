import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapDeviceCheckPhotos } from "./mapDeviceCheckPhotos";

describe("mapDeviceCheckPhotos", () => {
  it("keeps string photo paths", () => {
    assert.deepEqual(mapDeviceCheckPhotos(["/devices/checks/laptop/1.jpg"]), [
      "/devices/checks/laptop/1.jpg",
    ]);
  });

  it("extracts urls from vendor photo objects", () => {
    assert.deepEqual(
      mapDeviceCheckPhotos([
        {
          id: "photo-1",
          url: "https://assets.rayda.co/test/check.jpg",
        },
        { id: "photo-2" },
        "",
      ]),
      ["https://assets.rayda.co/test/check.jpg"],
    );
  });
});
