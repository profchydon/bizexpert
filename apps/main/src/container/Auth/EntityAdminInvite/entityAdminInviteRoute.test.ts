import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("EntityAdminInviteSessionWrapper", () => {
  it("clears the client auth session before rendering the invite screen", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/HOC/EntityAdminInviteSessionWrapper.tsx",
      ),
      "utf8",
    );

    assert.match(source, /clearClientAuthSession/);
    assert.match(source, /useAppDispatch/);
  });
});

describe("EntityAdminInvite route", () => {
  it("registers the public auth page", () => {
    const source = readFileSync(join(process.cwd(), "src/routes.ts"), "utf8");

    assert.match(source, /ENTITY_ADMIN_INVITE: "\/auth\/entity-admin-invite"/);
  });

  it("uses the same split-screen banner styling as employee invite", () => {
    const source = readFileSync(
      join(process.cwd(), "src/container/Auth/EntityAdminInvite/index.tsx"),
      "utf8",
    );

    assert.match(source, /object-contain/);
    assert.doesNotMatch(source, /object-cover/);
    assert.match(source, /lg:w-1\/2 px-10 sm:px-24 lg:px-16 xl:px-24/);
  });

  it("redirects invitees who still need employee setup to employee invite", () => {
    const source = readFileSync(
      join(process.cwd(), "src/container/Auth/EntityAdminInvite/index.tsx"),
      "utf8",
    );

    assert.match(source, /resolveEmployeeEntityAdminInvitePath/);
    assert.match(source, /router\.replace\(employeeInvitePath\)/);
  });
});
