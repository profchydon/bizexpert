import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { canAccessOrderChat } from "./chatAccess";

describe("canAccessOrderChat", () => {
  it("allows active Super Administrators", () => {
    assert.equal(
      canAccessOrderChat({ role: "Super Administrator", status: "Active" }),
      true,
    );
  });

  it("allows active Administrators", () => {
    assert.equal(
      canAccessOrderChat({ role: "Administrator", status: "active" }),
      true,
    );
  });

  it("denies inactive administrators", () => {
    assert.equal(
      canAccessOrderChat({ role: "Administrator", status: "invited" }),
      false,
    );
    assert.equal(
      canAccessOrderChat({ role: "Super Administrator", status: "suspended" }),
      false,
    );
  });

  it("denies non-administrator roles", () => {
    assert.equal(
      canAccessOrderChat({ role: "Basic", status: "Active" }),
      false,
    );
  });

  it("denies when the user is missing", () => {
    assert.equal(canAccessOrderChat(undefined), false);
    assert.equal(canAccessOrderChat(null), false);
  });
});
