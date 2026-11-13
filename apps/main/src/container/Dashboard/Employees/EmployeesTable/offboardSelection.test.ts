import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSelectionRecord,
  isPageFullySelected,
  isPagePartiallySelected,
  toggleEmployee,
  togglePage,
} from "./offboardSelection";
import type { IEmployees } from "@/types/employees";

const emp = (id: string): IEmployees => ({ id }) as IEmployees;

describe("toggleEmployee", () => {
  it("adds an employee when checked", () => {
    const next = toggleEmployee({}, emp("e1"), true);
    assert.deepEqual(Object.keys(next), ["e1"]);
  });

  it("removes an employee when unchecked", () => {
    const next = toggleEmployee({ e1: emp("e1") }, emp("e1"), false);
    assert.deepEqual(Object.keys(next), []);
  });

  it("returns the same map when nothing changes", () => {
    const map = { e1: emp("e1") };
    assert.equal(toggleEmployee(map, emp("e2"), false), map);
    assert.equal(toggleEmployee(map, { id: undefined } as any, true), map);
  });
});

describe("togglePage", () => {
  const page = [emp("e1"), emp("e2")];

  it("adds every page employee when checked, preserving others", () => {
    const next = togglePage({ x: emp("x") }, page, true);
    assert.deepEqual(Object.keys(next).sort(), ["e1", "e2", "x"]);
  });

  it("removes only the page employees when unchecked", () => {
    const next = togglePage({ e1: emp("e1"), x: emp("x") }, page, false);
    assert.deepEqual(Object.keys(next), ["x"]);
  });
});

describe("buildSelectionRecord", () => {
  it("maps each selected id to true", () => {
    assert.deepEqual(buildSelectionRecord({ e1: emp("e1"), e2: emp("e2") }), {
      e1: true,
      e2: true,
    });
  });
});

describe("page selection state", () => {
  const page = [emp("e1"), emp("e2")];

  it("detects a fully selected page", () => {
    assert.equal(
      isPageFullySelected({ e1: emp("e1"), e2: emp("e2") }, page),
      true,
    );
    assert.equal(isPageFullySelected({ e1: emp("e1") }, page), false);
    assert.equal(isPageFullySelected({}, []), false);
  });

  it("detects a partially selected page", () => {
    assert.equal(isPagePartiallySelected({ e1: emp("e1") }, page), true);
    assert.equal(
      isPagePartiallySelected({ e1: emp("e1"), e2: emp("e2") }, page),
      false,
    );
    assert.equal(isPagePartiallySelected({}, page), false);
  });
});
