import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatSafeImageSrc,
  isConfiguredRemoteImage,
  resolveSafeImageSrc,
} from "./safeImage.logic";

describe("formatSafeImageSrc", () => {
  it("keeps absolute URLs unchanged", () => {
    assert.equal(
      formatSafeImageSrc("https://cdn.example.com/image.png"),
      "https://cdn.example.com/image.png",
    );
  });

  it("normalizes relative paths to a leading slash", () => {
    assert.equal(formatSafeImageSrc("assets/photo.jpg"), "/assets/photo.jpg");
    assert.equal(formatSafeImageSrc("/assets/photo.jpg"), "/assets/photo.jpg");
  });

  it("converts protocol-relative URLs to https", () => {
    assert.equal(
      formatSafeImageSrc("//s3.amazonaws.com/bucket/image.png"),
      "https://s3.amazonaws.com/bucket/image.png",
    );
  });

  it("returns an empty string for blank values", () => {
    assert.equal(formatSafeImageSrc("   "), "");
  });

  it("returns an empty string for non-string sources", () => {
    assert.equal(
      formatSafeImageSrc({ url: "https://assets.rayda.co/a.jpg" }),
      "",
    );
  });
});

describe("isConfiguredRemoteImage", () => {
  it("allows configured remote hosts", () => {
    assert.equal(
      isConfiguredRemoteImage("https://assets.rayda.co/device.png"),
      true,
    );
  });

  it("rejects unconfigured remote hosts", () => {
    assert.equal(
      isConfiguredRemoteImage("https://cdn.example.com/device.png"),
      false,
    );
  });

  it("allows local paths", () => {
    assert.equal(isConfiguredRemoteImage("/assets/device.png"), true);
  });
});

describe("resolveSafeImageSrc", () => {
  it("falls back to the placeholder when the source is missing", () => {
    assert.equal(
      resolveSafeImageSrc(undefined, false, "/placeholder.svg"),
      "/placeholder.svg",
    );
  });

  it("falls back to the placeholder after an error", () => {
    assert.equal(
      resolveSafeImageSrc(
        "https://assets.rayda.co/device.png",
        true,
        "/placeholder.svg",
      ),
      "/placeholder.svg",
    );
  });
});
