import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCreatableSelectItems,
  createSelectKey,
  parseCreateSelectKey,
} from "./buildCreatableSelectItems";

const items = [
  { id: "lvl-1", label: "Senior" },
  { id: "lvl-2", label: "Staff" },
];

describe("buildCreatableSelectItems", () => {
  it("adds a create option when the query is not an existing label", () => {
    const next = buildCreatableSelectItems(items, " Intern ");
    assert.deepEqual(next, [
      {
        id: createSelectKey("Intern"),
        label: 'Create "Intern"',
      },
    ]);
  });

  it("does not add a create option when the label already exists", () => {
    assert.deepEqual(buildCreatableSelectItems(items, "staff"), [
      { id: "lvl-2", label: "Staff" },
    ]);
    assert.deepEqual(buildCreatableSelectItems(items, ""), items);
  });

  it("prompts to type when no levels exist yet", () => {
    assert.deepEqual(
      buildCreatableSelectItems([], "", "Type to create a level"),
      [
        {
          id: "__creatable_empty__",
          label: "Type to create a level",
          isDisabled: true,
        },
      ],
    );
  });

  it("parses create keys", () => {
    assert.equal(parseCreateSelectKey(createSelectKey("Lead")), "Lead");
    assert.equal(parseCreateSelectKey("lvl-1"), null);
  });
});
