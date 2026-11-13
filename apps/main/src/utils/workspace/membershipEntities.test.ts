import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import { resolveAccessContext } from "@/utils/auth/resolveAccessContext";
import {
  filterMembershipsForWorkspaceEntities,
  mapMembershipsToWorkspaceEntities,
} from "./membershipEntities";

const entityAdminMembership = (id: string, name: string): EntityMembership => ({
  id,
  name,
  is_primary: false,
  country: "United Kingdom",
  parent_company_id: "company-primary",
  role: "Administrator",
  scope: "entity",
  office_ids: [],
  via_global_admin: false,
});

describe("filterMembershipsForWorkspaceEntities", () => {
  it("returns administered entities for scoped admins", () => {
    const access = resolveAccessContext({ role: "Basic" } as IUser, [
      entityAdminMembership("entity-11", "Intensa UK 11"),
      entityAdminMembership("entity-13", "Intensa UK 13"),
    ]);

    const filtered = filterMembershipsForWorkspaceEntities(
      access.memberships,
      access,
    );

    assert.deepEqual(
      filtered.map((membership) => membership.id),
      ["entity-11", "entity-13"],
    );
  });
});

describe("mapMembershipsToWorkspaceEntities", () => {
  it("maps session memberships without calling the entities API shape", () => {
    const access = resolveAccessContext({ role: "Basic" } as IUser, [
      entityAdminMembership("entity-11", "Intensa UK 11"),
    ]);

    const entities = mapMembershipsToWorkspaceEntities(
      access.memberships,
      access,
    );

    assert.equal(entities[0]?.id, "entity-11");
    assert.equal(entities[0]?.name, "Intensa UK 11");
  });
});
