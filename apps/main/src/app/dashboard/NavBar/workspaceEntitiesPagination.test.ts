import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasMoreWorkspaceEntityPages,
  mergeWorkspaceEntityPages,
} from "./workspaceEntitiesPagination";

const entity = (id: string) =>
  ({
    id,
    name: `Entity ${id}`,
  }) as never;

describe("mergeWorkspaceEntityPages", () => {
  it("replaces entities on the first page", () => {
    assert.deepEqual(
      mergeWorkspaceEntityPages([entity("old")], [entity("a")], 1),
      [entity("a")],
    );
  });

  it("appends later pages without duplicates", () => {
    const firstPage = [entity("a"), entity("b")];
    const secondPage = [entity("b"), entity("c")];

    assert.deepEqual(mergeWorkspaceEntityPages(firstPage, secondPage, 2), [
      entity("a"),
      entity("b"),
      entity("c"),
    ]);
  });
});

describe("hasMoreWorkspaceEntityPages", () => {
  it("is true when the current page is before the last page", () => {
    assert.equal(hasMoreWorkspaceEntityPages(1, 3), true);
  });

  it("is false on the last page or when pagination is missing", () => {
    assert.equal(hasMoreWorkspaceEntityPages(3, 3), false);
    assert.equal(hasMoreWorkspaceEntityPages(undefined, 3), false);
  });

  it("falls back to total when page metadata is incomplete", () => {
    assert.equal(
      hasMoreWorkspaceEntityPages(undefined, undefined, 15, 20),
      true,
    );
    assert.equal(
      hasMoreWorkspaceEntityPages(undefined, undefined, 20, 20),
      false,
    );
  });
});
