import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import type { IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import { resolveAccessContext } from "@/utils/auth/resolveAccessContext";
import {
  GLOBAL_WORKSPACE_ID,
  appendEntityWorkspaceParam,
  buildWorkspaceOverviewPath,
  filterEntitiesForWorkspaceSwitcher,
  resolveActiveWorkspaceId,
} from "./activeWorkspace";

const globalMembership = (id: string): EntityMembership => ({
  id,
  name: id,
  is_primary: false,
  country: "United Kingdom",
  parent_company_id: "company-primary",
  role: "Basic",
  scope: "member",
  office_ids: [],
  via_global_admin: true,
});

const globalAccess = resolveAccessContext({ role: "Administrator" } as IUser, [
  globalMembership("entity-1"),
  globalMembership("entity-2"),
]);

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

const entityAdminAccess = resolveAccessContext({ role: "Basic" } as IUser, [
  entityAdminMembership("entity-11", "Intensa UK 11"),
  entityAdminMembership("entity-13", "Intensa UK 13"),
]);

const activeEntity = {
  id: "entity-uk",
  name: "Intensa United Kingdom 15",
  country: "United Kingdom",
  is_primary: false,
  lifecycle_status: "active",
  billing_status_badge: "operational",
} as never;

const primaryEntity = {
  id: "entity-primary",
  name: "Intensa",
  country: "United Kingdom",
  is_primary: true,
  lifecycle_status: "active",
  billing_status_badge: "operational",
} as never;

const foreignEntity = {
  id: "entity-foreign",
  name: "Other Entity",
  country: "Nigeria",
  is_primary: false,
  lifecycle_status: "active",
  billing_status_badge: "operational",
} as never;

describe("resolveActiveWorkspaceId", () => {
  it("prefers the entity query param over stored workspace scope for global admins", () => {
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: "entity-2",
        storedScopeId: "entity-1",
        access: globalAccess,
      }),
      "entity-2",
    );
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: null,
        storedScopeId: null,
        access: globalAccess,
      }),
      GLOBAL_WORKSPACE_ID,
    );
  });

  it("ignores a workspace from another account", () => {
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: "entity-foreign",
        storedScopeId: "entity-also-foreign",
        access: globalAccess,
      }),
      GLOBAL_WORKSPACE_ID,
    );
  });

  it("defaults entity-only admins to their first administered entity", () => {
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: null,
        storedScopeId: null,
        access: entityAdminAccess,
      }),
      "entity-11",
    );
  });

  it("rejects global workspace and foreign entities for entity-only admins", () => {
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: GLOBAL_WORKSPACE_ID,
        storedScopeId: "entity-foreign",
        access: entityAdminAccess,
      }),
      "entity-11",
    );
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: "entity-foreign",
        storedScopeId: null,
        access: entityAdminAccess,
      }),
      "entity-11",
    );
  });

  it("honours an administered entity from the query param", () => {
    assert.equal(
      resolveActiveWorkspaceId({
        entityFromUrl: "entity-13",
        storedScopeId: "entity-11",
        access: entityAdminAccess,
      }),
      "entity-13",
    );
  });
});

describe("filterEntitiesForWorkspaceSwitcher", () => {
  it("limits non-global admins to administered entities", () => {
    const administeredEntity = {
      id: "entity-11",
      name: "Intensa UK 11",
      country: "United Kingdom",
      is_primary: false,
      lifecycle_status: "active",
      billing_status_badge: "operational",
    } as never;

    const filtered = filterEntitiesForWorkspaceSwitcher(
      [primaryEntity, administeredEntity, foreignEntity],
      entityAdminAccess,
    );

    assert.deepEqual(
      filtered.map((entity) => entity.id),
      ["entity-11"],
    );
  });

  it("keeps the primary entity out of the global admin switcher list", () => {
    const filtered = filterEntitiesForWorkspaceSwitcher(
      [primaryEntity, activeEntity],
      globalAccess,
    );

    assert.deepEqual(
      filtered.map((entity) => entity.id),
      ["entity-uk"],
    );
  });
});

describe("workspace route helpers", () => {
  it("builds overview routes for global and entity workspaces", () => {
    assert.equal(
      buildWorkspaceOverviewPath(GLOBAL_WORKSPACE_ID),
      "/dashboard/overview",
    );
    assert.equal(
      buildWorkspaceOverviewPath("entity-11"),
      "/dashboard/overview?entity=entity-11",
    );
  });

  it("appends entity params to existing routes", () => {
    assert.equal(
      appendEntityWorkspaceParam("/dashboard/employees", "entity-11"),
      "/dashboard/employees?entity=entity-11",
    );
    assert.equal(
      appendEntityWorkspaceParam(
        "/dashboard/employees?tab=active",
        "entity-11",
      ),
      "/dashboard/employees?tab=active&entity=entity-11",
    );
  });

  it("hard-navigates to overview after persisting the selected workspace", () => {
    const source = readFileSync(
      new URL("./activeWorkspace.ts", import.meta.url),
      "utf8",
    );

    assert.match(source, /writeStoredWorkspaceScope/);
    assert.match(source, /markWorkspaceSwitchLoading\(scopeId\)/);
    assert.match(source, /showImmediateWorkspaceSwitchOverlay\(\)/);
    assert.match(source, /globalThis\.window\.location\.assign/);
    assert.match(source, /buildWorkspaceOverviewPath\(scopeId\)/);
  });
});
