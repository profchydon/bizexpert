import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canCreateEntities,
  canCreateOffices,
  canManageEntity,
  canManageOffice,
} from "./adminScope";

const subsidiary = {
  id: "sub-1",
  name: "Rayda UK",
  admins: ["Alex Admin"],
};

const office = {
  id: "office-1",
  name: "London HQ",
  officeAdmins: ["Jamie Office"],
};

const globalActing = {
  role: "global" as const,
  name: "Global Admin",
  administeredEntityIds: [],
  officeIds: [],
};

describe("adminScope", () => {
  it("allows global admins to manage any entity or office", () => {
    assert.equal(canManageEntity(subsidiary, globalActing), true);
    assert.equal(canManageOffice(office, globalActing), true);
    assert.equal(canCreateEntities(globalActing), true);
    assert.equal(canCreateOffices(globalActing), true);
  });

  it("allows entity admins only on administered entity ids", () => {
    const acting = {
      role: "subsidiary" as const,
      name: "Alex Admin",
      administeredEntityIds: ["sub-1"],
      officeIds: [],
    };

    assert.equal(canManageEntity(subsidiary, acting), true);
    assert.equal(
      canManageEntity({ ...subsidiary, id: "sub-2" }, acting),
      false,
    );
    assert.equal(canCreateEntities(acting), false);
    assert.equal(canCreateOffices(acting), true);
  });

  it("allows office admins only on assigned office ids", () => {
    const acting = {
      role: "office" as const,
      name: "Jamie Office",
      administeredEntityIds: [],
      officeIds: ["office-1"],
    };

    assert.equal(canManageOffice(office, acting), true);
    assert.equal(canManageOffice({ ...office, id: "office-2" }, acting), false);
    assert.equal(canCreateEntities(acting), false);
    assert.equal(canCreateOffices(acting), false);
  });
});
