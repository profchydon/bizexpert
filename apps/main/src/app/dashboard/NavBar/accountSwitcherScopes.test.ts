import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GLOBAL_WORKSPACE_ID,
  MISSING_SWITCHER_ENTITY_LABEL,
  buildSwitcherScopes,
  mergeSwitcherEntitySources,
  resolveSwitcherActiveScope,
} from "./accountSwitcherScopes";
import {
  filterSwitcherEntities,
  isSwitchableWorkspaceEntity,
} from "./filterSwitcherEntities";
import { resolveEntityCountryCode } from "./resolveEntityCountryCode";
import { resolveAccessContext } from "@/utils/auth/resolveAccessContext";
import type { IUser } from "@/types/auth";

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

const closedEntity = {
  id: "entity-closed",
  name: "Closed Entity",
  country: "Nigeria",
  is_primary: false,
  lifecycle_status: "closed",
  billing_status_badge: "closed",
} as never;

const globalAccess = resolveAccessContext(
  { role: "Administrator" } as IUser,
  [],
);

describe("resolveEntityCountryCode", () => {
  it("maps country names and refs to alpha-2 codes", () => {
    assert.equal(resolveEntityCountryCode("United Kingdom"), "GB");
    assert.equal(resolveEntityCountryCode("Australia"), "AU");
    assert.equal(
      resolveEntityCountryCode({ name: "Nigeria", code: "NG" }),
      "NG",
    );
  });
});

describe("filterSwitcherEntities", () => {
  it("removes closed and primary entities from the switcher list", () => {
    const filtered = filterSwitcherEntities(
      [primaryEntity, activeEntity, closedEntity],
      { excludePrimary: true },
    );

    assert.deepEqual(
      filtered.map((entity) => entity.id),
      ["entity-uk"],
    );
    assert.equal(isSwitchableWorkspaceEntity(closedEntity), false);
  });
});

describe("buildSwitcherScopes", () => {
  it("uses the primary entity for the global workspace row", () => {
    const scopes = buildSwitcherScopes({
      company: {
        id: "company-1",
        name: "Parent Co",
        country: { code: "US" },
      } as never,
      entities: [primaryEntity, activeEntity, closedEntity],
      access: globalAccess,
      activeScopeId: GLOBAL_WORKSPACE_ID,
    });

    assert.equal(scopes[0]?.label, "Intensa");
    assert.equal(scopes[0]?.countryCode, "GB");
    assert.equal(
      scopes.some(
        (scope) => scope.kind === "subsidiary" && scope.label === "Intensa",
      ),
      false,
    );
    assert.equal(
      scopes.some((scope) => scope.label === "Closed Entity"),
      false,
    );
  });
});

describe("mergeSwitcherEntitySources", () => {
  it("injects the active workspace when it is missing from the paginated entity list", () => {
    const merged = mergeSwitcherEntitySources({
      entities: [activeEntity],
      memberships: [],
      access: globalAccess,
      activeScopeId: "entity-nigeria-2",
    });

    assert.equal(
      merged.some((entity) => entity.id === "entity-nigeria-2"),
      true,
    );
    assert.equal(
      merged.find((entity) => entity.id === "entity-nigeria-2")?.name,
      "Workspace",
    );
  });
});

describe("resolveSwitcherActiveScope", () => {
  it("matches the trigger workspace to the resolved active scope id", () => {
    const scopes = buildSwitcherScopes({
      company: {
        id: "company-1",
        name: "Parent Co",
        country: { code: "US" },
      } as never,
      entities: [primaryEntity, activeEntity],
      access: globalAccess,
      activeScopeId: activeEntity.id,
    });

    const activeScope = resolveSwitcherActiveScope(scopes, activeEntity.id, {
      id: "company-1",
      name: "Parent Co",
    } as never);

    assert.equal(activeScope.id, activeEntity.id);
    assert.equal(activeScope.active, true);
  });
});
