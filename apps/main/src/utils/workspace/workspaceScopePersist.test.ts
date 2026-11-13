import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import workspaceScopeReducer, {
  setWorkspaceScope,
} from "../../store/slices/workspaceScopeSlice";

describe("workspaceScopePersist", () => {
  it("keeps workspaceScope in memory instead of stripping it on every action", () => {
    const source = readFileSync("src/store/rootReducer.ts", "utf8");
    assert.match(source, /blacklist: \["workspaceScope"\]/);
    assert.doesNotMatch(source, /if \(state && state.workspaceScope\)/);
  });

  it("keeps the active entity after an unrelated reducer action", () => {
    const scoped = workspaceScopeReducer(
      undefined,
      setWorkspaceScope({
        activeScopeId: "entity-1",
        activeEntityId: "entity-1",
      }),
    );
    const next = workspaceScopeReducer(scoped, { type: "cart/itemAdded" });
    assert.equal(next.activeEntityId, "entity-1");
    assert.equal(next.activeScopeId, "entity-1");
  });
});
