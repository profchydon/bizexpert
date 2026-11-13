import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { entityAdminInvitationsFromResponse } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitation";
import { acceptedAdminCount, managedEntityAdmins } from "./managedEntityAdmins";

describe("entityAdminInvitationsFromResponse", () => {
  it("reads a paginated invitation list", () => {
    const rows = entityAdminInvitationsFromResponse({
      data: {
        data: [
          {
            id: "inv-1",
            email: "ada@example.com",
            status: "pending",
          },
        ],
      },
    });

    assert.equal(rows[0]?.id, "inv-1");
  });
});

describe("managedEntityAdmins", () => {
  it("keeps accepted admins and adds pending invites", () => {
    const rows = managedEntityAdmins(
      [{ id: "user-1", name: "Ada", email: "ada@example.com" }],
      [
        {
          id: "inv-2",
          email: "bayo@example.com",
          user_id: "user-2",
          status: "pending",
        },
        {
          id: "inv-1",
          email: "ada@example.com",
          user_id: "user-1",
          status: "accepted",
        },
      ],
    );

    assert.deepEqual(
      rows.map((row) => row.email),
      ["ada@example.com", "bayo@example.com"],
    );
    assert.equal(rows[1]?.pending, true);
    assert.equal(rows[1]?.invitationId, "inv-2");
    assert.equal(acceptedAdminCount(rows), 1);
  });

  it("keeps expired invites so they can be cancelled", () => {
    const rows = managedEntityAdmins(
      [],
      [
        {
          id: "inv-3",
          email: "late@example.com",
          status: "expired",
        },
      ],
    );

    assert.equal(rows[0]?.pending, true);
  });
});
