import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const api = "src/api/baseQueries/companiesApi/entitiesApi";
const hook = "src/container/Dashboard/Accounts/hooks/useManageEntityAdmins.ts";

function read(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("entity admin access endpoints", () => {
  it("invites subsidiary admins", () => {
    const source = read(`${api}/inviteEntityAdmins.ts`);
    const contract = read(`${api}/entityAdminInvitation.ts`);
    assert.match(source, /\/\$\{entityId\}\/admins\/invite/);
    assert.match(source, /method: "POST"/);
    assert.match(contract, /admin_user_ids/);
  });

  it("revokes accepted entity admin access", () => {
    const source = read(`${api}/revokeEntityAdmin.ts`);
    const contract = read(`${api}/entityAdminInvitation.ts`);
    assert.match(source, /\/\$\{entityId\}\/admins\/revoke/);
    assert.match(source, /method: "POST"/);
    assert.match(contract, /user_id/);
  });

  it("cancels a pending entity admin invitation", () => {
    const source = read(`${api}/cancelEntityAdminInvitation.ts`);
    assert.match(
      source,
      /\/\$\{entityId\}\/admin-invitations\/\$\{invitationId\}/,
    );
    assert.match(source, /method: "DELETE"/);
  });

  it("uses invite, revoke, and cancel for subsidiaries", () => {
    const source = read(hook);
    const addAdmins = source.slice(
      source.indexOf("function addAdmins"),
      source.indexOf("function confirmRevoke"),
    );
    assert.match(source, /useInviteEntityAdminsMutation/);
    assert.match(source, /useRevokeEntityAdminMutation/);
    assert.match(source, /useCancelEntityAdminInvitationMutation/);
    assert.match(addAdmins, /admins\/invite|inviteAdmins/);
    assert.match(addAdmins, /displaySuccessMessage/);
    assert.match(addAdmins, /Invitation sent/);
    assert.doesNotMatch(addAdmins, /updateEntity/);
    assert.match(source, /isInviting: inviteState\.isLoading/);
    assert.match(source, /Invitation cancelled/);
    assert.match(source, /Access revoked/);
    assert.match(source, /isGenericApiErrorMessage\(title\) \? null/);
  });
});
