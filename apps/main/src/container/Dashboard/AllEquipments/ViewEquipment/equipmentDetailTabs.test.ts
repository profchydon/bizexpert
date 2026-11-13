import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  getHorizontalStyles,
  getTabStyles,
} from "@/components/application/tabs/tab-styles";
import { buildEquipmentDetailTabs } from "./equipmentDetailTabItems";

describe("application tabs button-border styles", () => {
  it("matches the reference inset track for button-border lists", () => {
    const styles = getHorizontalStyles({})["button-border"];

    assert.match(styles, /bg-secondary_alt/);
    assert.match(styles, /ring-secondary/);
    assert.doesNotMatch(styles, /w-full/);
  });

  it("matches the reference selected and hover pill styles", () => {
    const selected = getTabStyles({
      isSelected: true,
      isFocusVisible: false,
      isHovered: false,
      isPressed: false,
      isDisabled: false,
      isFocused: false,
      defaultClassName: "",
    })["button-border"];
    const hovered = getTabStyles({
      isSelected: false,
      isFocusVisible: false,
      isHovered: true,
      isPressed: false,
      isDisabled: false,
      isFocused: false,
      defaultClassName: "",
    })["button-border"];
    const idle = getTabStyles({
      isSelected: false,
      isFocusVisible: false,
      isHovered: false,
      isPressed: false,
      isDisabled: false,
      isFocused: false,
      defaultClassName: "",
    })["button-border"];

    assert.match(selected, /bg-primary_alt text-secondary shadow-sm/);
    assert.match(hovered, /bg-primary_alt text-secondary shadow-sm/);
    assert.doesNotMatch(idle, /bg-primary_alt/);
    assert.doesNotMatch(selected, /ring-secondary/);
  });
});

describe("equipment detail tab items", () => {
  it("adds document and unread note badges like the reference tabs", () => {
    const tabs = buildEquipmentDetailTabs({
      type: "Laptop",
      documents: [{ id: "1" }, { id: "2" }],
      note: [[{ read: false }, { read: true }]],
    } as any);

    assert.equal(tabs[1].badge, 2);
    assert.equal(tabs[2].badge, 1);
    assert.equal(
      tabs.some((tab) => tab.id === "telemetry"),
      false,
    );
  });
});

describe("equipment detail tabs wiring", () => {
  it("matches the reference tabs shell and panel layout", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailTabs.tsx",
      ),
      "utf8",
    );

    assert.match(source, /@\/components\/application\/tabs\/tabs/);
    assert.match(source, /type="button-border"/);
    assert.match(source, /viewEquipmentTabPanelClass/);
    assert.doesNotMatch(source, /fullWidth/);
    assert.doesNotMatch(source, /react-aria-components/);
  });
});
