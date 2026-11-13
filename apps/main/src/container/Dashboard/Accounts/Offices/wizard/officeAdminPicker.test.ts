import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const pickerSource = readFileSync(join(dir, "OfficeAdminPicker.tsx"), "utf8");
const listSource = readFileSync(
  join(dir, "..", "..", "components", "wizard", "WizardAdminOptionList.tsx"),
  "utf8",
);

describe("OfficeAdminPicker", () => {
  it("uses a modal popover so the list scrolls inside dialogs", () => {
    assert.match(pickerSource, /<Popover\s+modal/);
  });

  it("matches search terms against the country too", () => {
    assert.match(
      pickerSource,
      /\(option\.country \?\? ""\)\.toLowerCase\(\)\.includes\(term\)/,
    );
  });

  it("forwards search input to the server query", () => {
    assert.match(pickerSource, /onQueryChange\?\.\(next\)/);
  });

  it("keeps selected tags visible across searches and pages", () => {
    assert.match(pickerSource, /seenOptions\.current\.get\(entry\)/);
  });

  it("closes the list after an admin is chosen", () => {
    const toggle = pickerSource.slice(
      pickerSource.indexOf("function toggle"),
      pickerSource.indexOf("function removeTag"),
    );
    assert.match(toggle, /setOpen\(false\)/);
  });
});

describe("WizardAdminOptionList", () => {
  it("keeps the options list scrollable", () => {
    assert.match(listSource, /max-h-52 overflow-y-auto/);
  });

  it("greys out a teammate whose invitation is already pending", () => {
    assert.match(listSource, /option\.inviteState/);
    assert.match(listSource, /Pending invitation/);
    assert.match(listSource, /Already an admin/);
    assert.match(listSource, /cursor-not-allowed/);
    assert.match(listSource, /disabled=\{disabled \|\| locked\}/);
  });

  it("shows the option's country flag and name when available", () => {
    assert.match(listSource, /option\.countryCode && \(/);
    assert.match(listSource, /WizardRegionFlag code=\{option\.countryCode\}/);
    assert.match(listSource, /\{option\.country\}/);
  });

  it("offers a Load more control for further pages", () => {
    assert.match(listSource, /hasMore && onLoadMore && \(/);
    assert.match(listSource, /Load more/);
    assert.match(listSource, /disabled=\{isLoadingMore\}/);
  });
});
