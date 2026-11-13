import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createdSelectOptionLabel,
  mergeCreatedSelectOption,
} from "./mergeCreatedSelectOption";

describe("mergeCreatedSelectOption", () => {
  it("adds the created option with its name when the id is not in the list yet", () => {
    assert.deepEqual(
      mergeCreatedSelectOption([{ id: "dept-1", label: "Engineering" }], {
        id: "01a0a7336-ec4c-7378-b8fe-18400b855d1fec",
        label: "People Ops",
      }),
      [
        { id: "dept-1", label: "Engineering" },
        {
          id: "01a0a7336-ec4c-7378-b8fe-18400b855d1fec",
          label: "People Ops",
        },
      ],
    );
  });

  it("keeps the created name when the selected id is filtered out of the list", () => {
    const id = "01a0a7336-ec4c-7378-b8fe-18400b855d1fec";
    assert.equal(
      createdSelectOptionLabel([{ id, label: "People Ops" }], id, null),
      "People Ops",
    );
    assert.equal(
      createdSelectOptionLabel([], id, { id, label: "People Ops" }),
      "People Ops",
    );
  });

  it("does not show the raw id when the created row later appears without a label", () => {
    const id = "01a0a7336-ec4c-7378-b8fe-18400b855d1fec";
    assert.deepEqual(
      mergeCreatedSelectOption([{ id, label: "" }], {
        id,
        label: "People Ops",
      }),
      [{ id, label: "People Ops" }],
    );
  });

  it("keeps the created name when the list later has the id as its label", () => {
    const id = "01a0a7336-ec4c-7378-b8fe-18400b855d1fec";
    assert.deepEqual(
      mergeCreatedSelectOption([{ id, label: id }], {
        id,
        label: "People Ops",
      }),
      [{ id, label: "People Ops" }],
    );
  });
});
