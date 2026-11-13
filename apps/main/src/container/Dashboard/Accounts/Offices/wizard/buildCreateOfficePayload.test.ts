import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCreateOfficePayload,
  isWorkspaceOwnEntity,
} from "./buildCreateOfficePayload";

const draft = {
  name: "London HQ",
  parentId: "entity-1",
  type: "physical" as const,
  address: "1 Fleet Street",
  adminNames: ["user-1"],
};

describe("isWorkspaceOwnEntity", () => {
  it("matches the active workspace entity, ignoring surrounding whitespace", () => {
    assert.equal(isWorkspaceOwnEntity("entity-1", "entity-1"), true);
    assert.equal(isWorkspaceOwnEntity(" entity-1 ", "entity-1"), true);
  });

  it("does not match a different entity or an unresolved workspace", () => {
    assert.equal(isWorkspaceOwnEntity("entity-2", "entity-1"), false);
    assert.equal(isWorkspaceOwnEntity("entity-1", undefined), false);
    assert.equal(isWorkspaceOwnEntity("entity-1", ""), false);
  });
});

describe("subsidiary_id scoping", () => {
  it("omits subsidiary_id when the parent is the active workspace entity", () => {
    const payload = buildCreateOfficePayload(draft, "entity-1", "entity-1");

    assert.equal("subsidiary_id" in payload, false);
    assert.equal(Object.keys(payload).includes("subsidiary_id"), false);
  });

  it("sends subsidiary_id when creating under a different entity", () => {
    const payload = buildCreateOfficePayload(draft, "entity-2", "entity-1");

    assert.equal("subsidiary_id" in payload, true);
    assert.equal(payload.subsidiary_id, "entity-2");
  });

  it("sends subsidiary_id when the workspace id has not resolved", () => {
    const payload = buildCreateOfficePayload(draft, "entity-1", undefined);

    assert.equal(payload.subsidiary_id, "entity-1");
  });
});

describe("buildCreateOfficePayload", () => {
  it("builds a physical office payload with a trimmed address", () => {
    const payload = buildCreateOfficePayload(
      {
        name: "  London HQ ",
        parentId: "entity-1",
        type: "physical",
        address: " 1 Fleet Street ",
        adminNames: ["user-1", "user-2"],
      },
      "entity-1",
    );

    assert.deepEqual(payload, {
      name: "London HQ",
      type: "physical",
      street_address: "1 Fleet Street",
      subsidiary_id: "entity-1",
      admin_user_ids: ["user-1", "user-2"],
    });
  });

  it("omits the address for remote offices", () => {
    const payload = buildCreateOfficePayload(
      {
        name: "Remote team",
        parentId: "entity-1",
        type: "remote",
        address: "ignored",
        adminNames: ["user-1"],
      },
      "entity-1",
    );

    assert.equal(payload.street_address, undefined);
    assert.equal(payload.type, "remote");
  });
});
