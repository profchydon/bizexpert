import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { withDirectoryAdminState } from "./pendingAdminOptions";

const directory = [
  { value: "user-1", label: "Ada", email: "ada@example.com" },
  { value: "user-2", label: "Bayo", email: "bayo@example.com" },
  { value: "user-3", label: "Chioma", email: "chioma@example.com" },
];

describe("withDirectoryAdminState", () => {
  it("marks a pending invitation and an accepted admin", () => {
    const options = withDirectoryAdminState(directory, [
      { id: "user-1", email: "ada@example.com", pending: true },
      { id: "user-3", email: "chioma@example.com", pending: false },
    ]);

    assert.equal(options[0]?.inviteState, "pending");
    assert.equal(options[1]?.inviteState, undefined);
    assert.equal(options[2]?.inviteState, "accepted");
  });

  it("matches a pending invite by email when the user id differs", () => {
    const options = withDirectoryAdminState(directory, [
      { id: "invite-9", email: "Bayo@example.com", pending: true },
    ]);

    assert.equal(options[1]?.inviteState, "pending");
  });

  it("matches an accepted admin by email when the user id differs", () => {
    const options = withDirectoryAdminState(directory, [
      { id: "membership-4", email: "Chioma@example.com", pending: false },
    ]);

    assert.equal(options[2]?.inviteState, "accepted");
  });
});
