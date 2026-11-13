import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const ASSIGNMENT_FLOW =
  "src/container/Dashboard/EquipEmployee/AssignmentFlow/index.tsx";

describe("assignment flow company id", () => {
  it("imports the workspace company id hook it calls", () => {
    const source = read(ASSIGNMENT_FLOW);

    assert.match(
      source,
      /import \{ useWorkspaceCompanyId \} from "@\/hooks\/useWorkspaceCompanyId";/,
    );
    assert.match(source, /const companyId = useWorkspaceCompanyId\(\);/);
  });

  it("passes the workspace company id to useAssignmentEmployees", () => {
    const source = read(ASSIGNMENT_FLOW);

    assert.match(
      source,
      /useAssignmentEmployees\(companyId, cartsWithCountry, selectedCountry\)/,
    );
    assert.doesNotMatch(source, /useAssignmentEmployees\(company\?\.id/);
  });

  it("no longer imports the unused auth user detail hook", () => {
    assert.doesNotMatch(read(ASSIGNMENT_FLOW), /useAuthUserDetail/);
  });
});
