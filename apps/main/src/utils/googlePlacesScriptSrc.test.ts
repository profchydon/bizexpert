import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { googlePlacesScriptSrc } from "./googlePlacesScriptSrc";

describe("googlePlacesScriptSrc", () => {
  it("builds the places script url with the mapFinder callback", () => {
    const src = googlePlacesScriptSrc("test-key");
    const url = new URL(src);
    assert.equal(url.origin, "https://maps.googleapis.com");
    assert.equal(url.pathname, "/maps/api/js");
    assert.equal(url.searchParams.get("key"), "test-key");
    assert.equal(url.searchParams.get("libraries"), "places");
    assert.equal(url.searchParams.get("callback"), "mapFinder");
  });

  it("returns empty when the key is missing or blank", () => {
    assert.equal(googlePlacesScriptSrc(undefined), "");
    assert.equal(googlePlacesScriptSrc("   "), "");
  });
});

describe("root layout maps and fonts", () => {
  const read = (path: string) =>
    readFileSync(join(process.cwd(), path), "utf8");

  it("does not load Google Maps from the root layout", () => {
    const layout = read("src/app/layout.tsx");
    assert.doesNotMatch(layout, /maps\.googleapis\.com/);
    assert.match(layout, /weight: \["300", "400", "500", "600", "700"\]/);
    assert.doesNotMatch(layout, /"100"|"200"/);
  });

  it("loads Google Maps from the address finder", () => {
    const finder = read("src/components/mapLocation/MapLocationFinder.tsx");
    assert.match(finder, /GooglePlacesScript/);
    const script = read("src/components/GooglePlacesScript.tsx");
    assert.match(script, /googlePlacesScriptSrc/);
    assert.match(script, /id="google-maps-places"/);
  });
});
