import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withCurrentSelectOption } from "./editEmployeeFormOptions";

describe("withCurrentSelectOption", () => {
  it("replaces an id-as-label with the provided name", () => {
    const id = "01a0a7336-ec4c-7378-b8fe-18400b855d1fec";
    assert.deepEqual(
      withCurrentSelectOption([{ id, label: id }], id, "People Ops"),
      [{ id, label: "People Ops" }],
    );
  });

  it("adds a named option when the selected id is missing", () => {
    const id = "01a0a7336-ec4c-7378-b8fe-18400b855d1fec";
    assert.deepEqual(
      withCurrentSelectOption(
        [{ id: "dept-1", label: "Engineering" }],
        id,
        "People Ops",
      ),
      [
        { id: "dept-1", label: "Engineering" },
        { id, label: "People Ops" },
      ],
    );
  });
});
