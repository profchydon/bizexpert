import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("OtherDetailsSlideout", () => {
  it("uses design-ui SlideoutMenu shell and sensitive fields", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/OtherDetailsSlideout.tsx",
      ),
      "utf8",
    );

    assert.match(source, /SlideoutMenu/);
    assert.match(source, /SlideoutMenu\.Header/);
    assert.match(source, /SlideoutMenu\.Content/);
    assert.match(source, /SlideoutMenu\.Footer/);
    assert.match(source, /SensitiveField/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/sensitiveFieldClasses.ts",
        ),
        "utf8",
      ),
      /sensitiveFieldValueClass/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/SensitiveField.tsx",
        ),
        "utf8",
      ),
      /sensitiveFieldRowClass/,
    );
    assert.match(source, /Personal email/);
    assert.match(source, /Employee tax identification number/);
    assert.doesNotMatch(source, /DrawerRight/);
    assert.doesNotMatch(source, /Employee type/);
  });
});

describe("slideout-menu", () => {
  it("applies resizable width via css variable", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/application/slideout-menus/slideout-menu.tsx",
      ),
      "utf8",
    );
    const styles = readFileSync(
      join(process.cwd(), "src/styles/globals.css"),
      "utf8",
    );

    assert.match(source, /data-slideout-resizable/);
    assert.match(source, /--slideout-width/);
    assert.match(source, /width: resize\.width/);
    assert.match(styles, /\[data-slideout-resizable\]/);
    assert.match(styles, /width: var\(--slideout-width/);
  });

  it("stacks above the dashboard navbar", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/application/slideout-menus/slideout-menu.tsx",
      ),
      "utf8",
    );

    assert.match(source, /SLIDEOUT_MENU_OVERLAY_CLASS/);
    assert.match(source, /items-stretch/);
  });
});
