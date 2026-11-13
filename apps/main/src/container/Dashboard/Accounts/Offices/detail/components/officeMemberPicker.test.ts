import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { shouldShowOfficeMemberPickerList } from "./OfficeMemberPicker";

const dir = dirname(fileURLToPath(import.meta.url));
const pickerSource = readFileSync(join(dir, "OfficeMemberPicker.tsx"), "utf8");
const listSource = readFileSync(
  join(dir, "OfficeMemberOptionList.tsx"),
  "utf8",
);

describe("OfficeMemberPicker outside click", () => {
  it("closes the list when pointerdown happens outside the field", () => {
    assert.match(pickerSource, /document\.addEventListener\("pointerdown"/);
    assert.match(
      pickerSource,
      /if \(target && containerRef\.current\?\.contains\(target\)\) return/,
    );
    assert.match(pickerSource, /setFocused\(false\)/);
  });
});

describe("shouldShowOfficeMemberPickerList", () => {
  it("hides options until the search field is focused", () => {
    assert.equal(shouldShowOfficeMemberPickerList(false), false);
    assert.equal(shouldShowOfficeMemberPickerList(true), true);
  });
});

describe("OfficeMemberPicker selected tags", () => {
  it("renders selected options as removable tags in the field", () => {
    assert.match(pickerSource, /selectedOptions\.map\(\(option\) => \(/);
    assert.match(pickerSource, /data-testid="officememberpicker-tag"/);
    assert.match(pickerSource, /aria-label=\{`Remove \$\{option\.label\}`\}/);
  });

  it("resolves tags from every option ever seen, not just the current page", () => {
    assert.match(
      pickerSource,
      /seenOptionsRef\.current\.set\(option\.id, option\)/,
    );
    assert.match(
      pickerSource,
      /selectedIds\s*\n?\s*\.map\(\(id\) => seenOptionsRef\.current\.get\(id\)\)/,
    );
  });

  it("keeps focus in the field when a tag is removed", () => {
    const tagBlock = pickerSource.slice(
      pickerSource.indexOf("officememberpicker-tag"),
      pickerSource.indexOf("</span>"),
    );
    assert.match(
      pickerSource,
      /aria-label=\{`Remove \$\{option\.label\}`\}[\s\S]*?onMouseDown=\{\(event\) => event\.preventDefault\(\)\}/,
    );
    assert.ok(tagBlock.length > 0);
  });
});

describe("OfficeMemberPicker field width", () => {
  it("keeps the field from spilling outside the modal", () => {
    assert.match(pickerSource, /flex min-h-10 w-full[^"]*overflow-hidden/);
  });

  it("lets the search row shrink and wrap instead of forcing a min width", () => {
    assert.match(pickerSource, /flex min-w-0 flex-\[1_1_140px\] items-center/);
    assert.doesNotMatch(pickerSource, /min-w-\[140px\]/);
  });

  it("allows the input itself to shrink below its intrinsic size", () => {
    assert.match(pickerSource, /h-7 w-full min-w-0 flex-1 bg-transparent/);
  });

  it("truncates long tag labels rather than widening the field", () => {
    assert.match(pickerSource, /min-w-0 truncate font-medium/);
  });
});

describe("OfficeMemberOptionList load more", () => {
  it("renders a load-more button only when more pages exist", () => {
    assert.match(listSource, /\{hasMore && onLoadMore && \(/);
    assert.match(
      listSource,
      /\{isLoadingMore \? "Loading\.\.\." : "Load more"\}/,
    );
  });

  it("keeps the input focused when load more is clicked", () => {
    const loadMoreBlock = listSource.slice(
      listSource.indexOf("{hasMore && onLoadMore"),
    );
    assert.match(
      loadMoreBlock,
      /onMouseDown=\{\(event\) => event\.preventDefault\(\)\}/,
    );
    assert.match(loadMoreBlock, /data-testid="officememberpicker-load-more"/);
  });
});
