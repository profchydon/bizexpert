import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/Offices/hooks/useOfficeAdmins.ts",
  ),
  "utf8",
);

describe("useOfficeAdmins", () => {
  it("invites and revokes through the office admin routes", () => {
    assert.match(source, /useInviteOfficeAdminsMutation/);
    assert.match(source, /useRevokeOfficeAdminsMutation/);
    assert.match(source, /admin_user_ids: userIds/);
    assert.match(source, /user_id: revokingAdmin\.id/);
  });
});
