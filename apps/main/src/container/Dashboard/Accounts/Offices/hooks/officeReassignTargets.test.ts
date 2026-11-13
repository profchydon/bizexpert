import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Office } from "../../types";
import { filterReassignTargets } from "../utils/reassignTargets";

const office = (overrides: {
  id: string;
  subsidiaryId: string;
  status?: string;
}) => overrides as unknown as Office;

const source = office({ id: "src", subsidiaryId: "entity-a" });

describe("filterReassignTargets", () => {
  it("only offers offices under the same entity as the source office", () => {
    const targets = filterReassignTargets(
      [
        office({ id: "same-entity", subsidiaryId: "entity-a" }),
        office({ id: "other-entity", subsidiaryId: "entity-b" }),
      ],
      source,
    );
    assert.deepEqual(
      targets.map((entry) => entry.id),
      ["same-entity"],
    );
  });

  it("excludes the source office itself", () => {
    const targets = filterReassignTargets(
      [office({ id: "src", subsidiaryId: "entity-a" })],
      source,
    );
    assert.equal(targets.length, 0);
  });

  it("excludes closed offices", () => {
    const targets = filterReassignTargets(
      [office({ id: "closed", subsidiaryId: "entity-a", status: "closed" })],
      source,
    );
    assert.equal(targets.length, 0);
  });
});

describe("ReassignOfficeModal copy", () => {
  it("says They for a single employee and It only for a single asset", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const modalSource = readFileSync(
      join(dir, "../detail/components/ReassignOfficeModal.tsx"),
      "utf8",
    );
    assert.match(
      modalSource,
      /\{count === 1 && kind === "assets" \? "It" : "They"\}/,
    );
  });
});
