import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("postcss.config", () => {
  it("registers the Tailwind PostCSS plugin by package name", () => {
    const source = readFileSync("postcss.config.mjs", "utf8");

    assert.match(source, /"@tailwindcss\/postcss"/);
    assert.doesNotMatch(source, /require\.resolve/);
  });

  it("resolves the installed @tailwindcss/postcss plugin", () => {
    const plugin = require("@tailwindcss/postcss") as unknown;
    assert.equal(typeof plugin, "function");
  });
});

describe("tailwind react-aria plugin", () => {
  it("registers and resolves tailwindcss-react-aria-components", () => {
    const globals = readFileSync("src/styles/globals.css", "utf8");

    assert.match(globals, /@plugin "tailwindcss-react-aria-components"/);
    assert.equal(
      typeof require("tailwindcss-react-aria-components"),
      "function",
    );
  });
});

describe("vendor CSS imports", () => {
  it("does not import node_modules CSS from the root layout", () => {
    const source = readFileSync("src/app/layout.tsx", "utf8");

    assert.doesNotMatch(source, /react-modern-drawer\/dist\/index\.css/);
    assert.doesNotMatch(source, /react-tagsinput\/react-tagsinput\.css/);
    assert.doesNotMatch(source, /@cyntler\/react-doc-viewer\/dist\/index\.css/);
  });

  it("loads third-party CSS through the app stylesheet", () => {
    const globals = readFileSync("src/styles/globals.css", "utf8");
    const vendor = readFileSync("src/styles/vendor.css", "utf8");

    assert.match(globals, /@import "\.\/vendor\.css"/);
    assert.match(vendor, /react-modern-drawer\/dist\/index\.css/);
    assert.match(vendor, /react-tagsinput\/react-tagsinput\.css/);
  });

  it("loads react-doc-viewer CSS through a JS import Next can resolve", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    const vendorDocViewer = readFileSync(
      "src/styles/vendorDocViewerCss.ts",
      "utf8",
    );

    assert.match(layout, /@\/styles\/vendorDocViewerCss/);
    assert.match(
      vendorDocViewer,
      /@cyntler\/react-doc-viewer\/dist\/index\.css/,
    );
  });
});
