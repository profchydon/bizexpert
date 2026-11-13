import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("EntityAdminInviteSummaryCard", () => {
  it("renders invite detail rows including role", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EntityAdminInvite/EntityAdminInviteSummaryCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Invite details/);
    assert.match(source, /Email/);
    assert.match(source, /Entity/);
    assert.match(source, /Account/);
    assert.match(source, /Role/);
    assert.match(source, /entityAdminInviteRoleLabel/);
  });
});

describe("EntityAdminInviteAcceptIntro", () => {
  it("uses a short title and bold entity name in the body", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EntityAdminInvite/EntityAdminInviteAcceptIntro.tsx",
      ),
      "utf8",
    );

    assert.match(source, /entityAdminInviteEyebrow/);
    assert.match(source, /entityAdminInviteTitle/);
    assert.match(source, /font-semibold text-gray-900/);
    assert.doesNotMatch(source, /You've been invited to administer/);
  });
});

describe("EntityAdminInvitePanel", () => {
  it("shows an expiry chip above the accept button", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Auth/EntityAdminInvite/EntityAdminInvitePanel.tsx",
      ),
      "utf8",
    );

    assert.match(source, /EntityAdminInviteAcceptIntro/);
    assert.match(source, /EntityAdminInviteSummaryCard/);
    assert.match(source, /entityAdminInviteExpiryChipLabel/);
    assert.match(source, /entityAdminInviteAlternateLoginLabel/);
    assert.doesNotMatch(source, /Already logged in elsewhere/);
  });
});
