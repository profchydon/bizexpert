import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  UNRESOLVED_WORKSPACE_LABEL,
  isUnresolvedWorkspaceLabel,
} from "./unresolvedWorkspaceLabel";

describe("unresolvedWorkspaceLabel", () => {
  it("uses a short label that does not truncate to Selecte", () => {
    assert.equal(UNRESOLVED_WORKSPACE_LABEL, "Workspace");
    assert.equal(UNRESOLVED_WORKSPACE_LABEL.startsWith("Select"), false);
    assert.equal(isUnresolvedWorkspaceLabel("Workspace"), true);
    assert.equal(isUnresolvedWorkspaceLabel("Selected workspace"), false);
  });
});
