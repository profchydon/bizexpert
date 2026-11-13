import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { overviewShowsPendingAdminInvitation } from "./overviewAdminInvitation";

describe("overviewShowsPendingAdminInvitation", () => {
  it("shows the badge when nobody is listed and an invite is still open", () => {
    assert.equal(
      overviewShowsPendingAdminInvitation(0, [{ status: "pending" }]),
      true,
    );
    assert.equal(
      overviewShowsPendingAdminInvitation(0, [{ status: "expired" }]),
      true,
    );
    assert.equal(
      overviewShowsPendingAdminInvitation(0, [{ status: "accepted" }]),
      true,
    );
  });

  it("keeps the dash when invites are closed or admins are already listed", () => {
    assert.equal(
      overviewShowsPendingAdminInvitation(0, [{ status: "cancelled" }]),
      false,
    );
    assert.equal(
      overviewShowsPendingAdminInvitation(0, [{ status: "rejected" }]),
      false,
    );
    assert.equal(
      overviewShowsPendingAdminInvitation(0, [{ status: "access_revoked" }]),
      false,
    );
    assert.equal(
      overviewShowsPendingAdminInvitation(2, [{ status: "pending" }]),
      false,
    );
    assert.equal(overviewShowsPendingAdminInvitation(0, []), false);
  });
});
