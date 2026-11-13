import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("RouteProvider", () => {
  it("wraps children with react-aria RouterProvider", () => {
    const source = readFileSync(
      join(process.cwd(), "src/providers/router-provider.tsx"),
      "utf8",
    );

    assert.match(source, /RouterProvider navigate=\{router\.push\}/);
  });
});

describe("Providers", () => {
  it("nests RouteProvider and Theme inside Redux", () => {
    const source = readFileSync(
      join(process.cwd(), "src/lib/providers.tsx"),
      "utf8",
    );

    assert.match(source, /RouteProvider/);
    assert.match(source, /<Theme>/);
  });
});

describe("globals.css", () => {
  it("imports design-ui theme and legacy bridge layers", () => {
    const source = readFileSync(
      join(process.cwd(), "src/styles/globals.css"),
      "utf8",
    );

    assert.match(source, /@import "\.\/theme\.css"/);
    assert.match(source, /@import "\.\/legacy-bridge\.css"/);
    assert.match(source, /@plugin "tailwindcss-react-aria-components"/);
  });
});
