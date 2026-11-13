import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { toOfficeAsset } from "../../utils/mapOfficeMembers.ts";

const dir = dirname(fileURLToPath(import.meta.url));
const tableSource = readFileSync(join(dir, "OfficeAssetsTable.tsx"), "utf8");

const asset = (fields: Record<string, unknown>) =>
  toOfficeAsset({ id: "asset-1", title: "MacBook", ...fields } as never);

describe("office asset assignee mapping", () => {
  it("keeps the assignee id and name alongside the display text", () => {
    const row = asset({
      assignee: { id: "emp-1", name: "Tunji Ade" },
      office_area: null,
    });

    assert.equal(row.assigneeId, "emp-1");
    assert.equal(row.assigneeName, "Tunji Ade");
    assert.equal(row.assignedTo, "Tunji Ade");
  });

  it("prefers the assignee over the office area so display matches sorting", () => {
    const row = asset({
      assignee: { id: "emp-1", name: "Tunji Ade" },
      office_area: { id: "area-1", name: "Area 1" },
    });

    assert.equal(row.assignedTo, "Tunji Ade");
    assert.equal(row.officeAreaName, "Area 1");
  });

  it("falls back to the office area when nobody is assigned", () => {
    const row = asset({
      assignee: null,
      office_area: { id: "area-1", name: "Area 1" },
    });

    assert.equal(row.assigneeId, "");
    assert.equal(row.assigneeName, "");
    assert.equal(row.assignedTo, "Area 1");
  });

  it("falls back to the placeholder with neither assignee nor area", () => {
    const row = asset({ assignee: null, office_area: null });

    assert.equal(row.assignedTo, "No specific area");
    assert.equal(row.assigneeId, "");
  });

  it("does not link an assignee returned without an id", () => {
    const row = asset({ assignee: { name: "Tunji Ade" }, office_area: null });

    assert.equal(row.assigneeId, "");
    assert.equal(row.assigneeName, "Tunji Ade");
  });
});

describe("OfficeAssetsTable assigned-to cell", () => {
  it("links the assignee to their employee detail page", () => {
    assert.match(
      tableSource,
      /href=\{`\$\{routes\.EMPLOYEES\}\/\$\{asset\.assigneeId\}`\}/,
    );
    assert.match(tableSource, /from "next\/link"/);
    assert.match(tableSource, /\{asset\.assigneeName\}/);
  });

  it("only links when both an id and a name are present", () => {
    assert.match(tableSource, /asset\.assigneeId && asset\.assigneeName \?/);
    assert.match(
      tableSource,
      /<p className="truncate">\{asset\.assignedTo\}<\/p>/,
    );
  });

  it("keeps the row selection from firing when the link is clicked", () => {
    assert.match(
      tableSource,
      /onClick=\{\(event\) => event\.stopPropagation\(\)\}/,
    );
  });

  it("shows the office area beneath the assignee when both exist", () => {
    assert.match(
      tableSource,
      /asset\.assigneeName && asset\.officeAreaName &&/,
    );
    assert.match(tableSource, /\{asset\.officeAreaName\}/);
  });
});
