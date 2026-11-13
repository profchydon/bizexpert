import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import routes from "@/routes";
import { officeAdminInviteDestinationFromSearch } from "./officeAdminInviteRedirect";

const nextConfig = readFileSync("next.config.mjs", "utf8");
const middleware = readFileSync("src/middleware.ts", "utf8");
const page = readFileSync("src/app/auth/office-admin-invite/page.tsx", "utf8");

describe("office admin invite redirect", () => {
  it("keeps the invite code when rewriting to entity-admin-invite", () => {
    const code = "34409455-d276-4169-a06f-2bc5a54d9fab";
    assert.equal(
      officeAdminInviteDestinationFromSearch({ code }),
      `${routes.ENTITY_ADMIN_INVITE}?code=${code}`,
    );
  });

  it("keeps every query param on the rewritten path", () => {
    assert.equal(
      officeAdminInviteDestinationFromSearch({
        code: "invite-code",
        next: "dashboard",
      }),
      `${routes.ENTITY_ADMIN_INVITE}?code=invite-code&next=dashboard`,
    );
  });

  it("sends /auth/office-admin-invite to entity-admin-invite before render", () => {
    assert.equal(routes.OFFICE_ADMIN_INVITE, "/auth/office-admin-invite");
    assert.equal(routes.ENTITY_ADMIN_INVITE, "/auth/entity-admin-invite");
    assert.match(page, /officeAdminInviteDestinationFromSearch/);
    assert.match(page, /redirect\(/);
    assert.doesNotMatch(page, /"use client"/);
    assert.match(nextConfig, /source: "\/auth\/office-admin-invite"/);
    assert.match(nextConfig, /source: "\/auth\/office-admin-invite\/"/);
    assert.match(nextConfig, /destination: "\/auth\/entity-admin-invite"/);
    assert.match(middleware, /getOfficeAdminInviteRedirect/);
    assert.match(middleware, /pathname !== "\/auth\/office-admin-invite"/);
    assert.match(middleware, /"\/auth\/entity-admin-invite"/);
    assert.match(
      middleware,
      /destinationUrl\.search = request\.nextUrl\.search/,
    );
    assert.match(middleware, /"\/auth\/office-admin-invite"/);
    assert.match(middleware, /"\/auth\/office-admin-invite\/"/);
  });
});
