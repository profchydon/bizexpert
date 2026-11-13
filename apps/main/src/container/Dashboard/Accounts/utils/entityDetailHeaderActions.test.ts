import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  adminIdsAfterRevoke,
  entityAdminInitials,
  entityDetailHeaderActions,
  nextAdminUserIds,
} from "./entityDetailHeaderActions";

describe("entityDetailHeaderActions", () => {
  it("shows replace card and manage admins for a primary entity with a card", () => {
    assert.deepEqual(
      entityDetailHeaderActions({
        isPrimary: true,
        canEdit: true,
        canClose: false,
        cardOnFile: true,
      }),
      ["replace-card", "manage-admins"],
    );
  });

  it("shows add card when the primary entity has no card on file", () => {
    assert.deepEqual(
      entityDetailHeaderActions({
        isPrimary: true,
        canEdit: true,
        canClose: false,
        cardOnFile: false,
      }),
      ["add-card", "manage-admins"],
    );
  });

  it("hides actions when a primary entity is closed", () => {
    assert.deepEqual(
      entityDetailHeaderActions({
        isPrimary: true,
        canEdit: false,
        canClose: false,
        cardOnFile: true,
      }),
      [],
    );
  });

  it("shows edit, manage admins, and close for an open non-primary entity", () => {
    assert.deepEqual(
      entityDetailHeaderActions({
        isPrimary: false,
        canEdit: true,
        canClose: true,
        cardOnFile: false,
      }),
      ["edit", "manage-admins", "close"],
    );
  });

  it("hides actions when a non-primary entity is closed", () => {
    assert.deepEqual(
      entityDetailHeaderActions({
        isPrimary: false,
        canEdit: false,
        canClose: false,
        cardOnFile: true,
      }),
      [],
    );
  });
});

describe("entity admin updates", () => {
  it("appends new admin ids without duplicating current ones", () => {
    assert.deepEqual(nextAdminUserIds(["a"], ["a", "b", ""]), ["a", "b"]);
  });

  it("keeps the last admin when a revoke is requested", () => {
    assert.deepEqual(adminIdsAfterRevoke(["a"], "a"), ["a"]);
    assert.deepEqual(adminIdsAfterRevoke(["a", "b"], "a"), ["b"]);
  });

  it("builds initials from a name or an email", () => {
    assert.equal(entityAdminInitials("Sofia Marchetti"), "SM");
    assert.equal(entityAdminInitials("dana.lee@acme.com"), "DL");
  });
});
