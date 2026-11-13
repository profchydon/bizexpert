import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  ASSET_MIX_PALETTE,
  assetMixColorClasses,
  DEVICE_TYPE_BAR_CLASS,
} from "./deviceTypeMeta";

const requireFromRoot = createRequire(join(process.cwd(), "package.json"));
const theme = requireFromRoot("./theme.js") as {
  colors: Record<string, string | Record<string, string>>;
};

function resolvesToThemeColor(className: string) {
  const match = /^bg-([a-z]+)(?:-(\d+))?$/.exec(className);
  if (!match) return false;
  const [, name, shade] = match;
  const palette = theme.colors[name];
  if (!palette) return false;
  if (typeof palette === "string") return shade === undefined;
  if (shade === undefined) return "DEFAULT" in palette;
  return shade in palette;
}

describe("DEVICE_TYPE_BAR_CLASS", () => {
  it("only uses colors that exist in the project Tailwind palette", () => {
    for (const [type, className] of Object.entries(DEVICE_TYPE_BAR_CLASS)) {
      assert.ok(
        resolvesToThemeColor(className),
        `${type} uses ${className}, which is not in theme.js colors`,
      );
    }
  });

  it("gives every device type a distinct color", () => {
    const classes = Object.values(DEVICE_TYPE_BAR_CLASS);
    assert.equal(new Set(classes).size, classes.length);
  });
});

describe("assetMixColorClasses", () => {
  it("assigns distinct colors to every category in the mix", () => {
    const colors = assetMixColorClasses(["Macbook", "Monitor", "Laptop"]);
    const values = [...colors.values()];
    assert.equal(new Set(values).size, values.length);
  });

  it("assigns distinct colors even for unrecognised categories", () => {
    const colors = assetMixColorClasses(["Imac", "Widget", "Gadget"]);
    const values = [...colors.values()];
    assert.equal(new Set(values).size, values.length);
  });

  it("only hands out palette or canonical colors", () => {
    const known = new Set([
      ...ASSET_MIX_PALETTE,
      ...Object.values(DEVICE_TYPE_BAR_CLASS),
    ]);
    const colors = assetMixColorClasses([
      "Macbook",
      "Imac",
      "Accessories",
      "Laptop",
      "Laptop/Workstation",
      "Tablet",
      "Monitor",
    ]);
    for (const value of colors.values()) assert.ok(known.has(value));
    const values = [...colors.values()];
    assert.equal(new Set(values).size, values.length);
  });

  it("uses palette colors that exist in the Tailwind theme", () => {
    for (const className of ASSET_MIX_PALETTE) {
      assert.ok(
        resolvesToThemeColor(className),
        `${className} is not in theme.js colors`,
      );
    }
  });
});
