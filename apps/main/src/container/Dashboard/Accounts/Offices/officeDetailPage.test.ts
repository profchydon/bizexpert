import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "OfficeDetailPage.tsx"), "utf8");
const routeSource = readFileSync(
  join(dir, "../../../../app/dashboard/accounts/offices/[officeId]/page.tsx"),
  "utf8",
);

describe("OfficeDetailPage", () => {
  it("reads the office from the server detail hook scoped to its entity", () => {
    assert.match(source, /useOfficeDetail\(\s*officeId,\s*entityId,?\s*\)/);
    assert.doesNotMatch(source, /useOfficeEmployees|useOfficeAssets\b/);
    assert.doesNotMatch(source, /saveOfficeEdit/);
  });

  it("closes the office through the server mutation under its own entity", () => {
    assert.match(source, /useCloseOfficeMutation/);
    assert.match(source, /companyId: office\.subsidiaryId/);
    assert.doesNotMatch(source, /readiness=/);
    assert.match(source, /isClosing=\{closeResult\.isLoading \|\| isPending\}/);
  });

  it("redirects after a successful close based on where the visit started", () => {
    assert.match(source, /useTransitionRouter/);
    assert.match(source, /officeCloseRedirectPath\(entityId, fromSubsidiary\)/);
  });

  it("passes server areas and snapshot to the cards", () => {
    assert.match(source, /snapshot=\{snapshot\}/);
    assert.match(source, /areas=\{areas\}/);
  });

  it("renders the shared loader while fetching, not a skeleton", () => {
    assert.match(source, /import Loader from "@\/components\/Loader"/);
    assert.match(source, /if \(isLoading\) return <OfficeDetailLoading \/>;/);
    assert.match(
      source,
      /function OfficeDetailLoading\(\)[\s\S]*?<Loader \/>[\s\S]*?\n\}/,
    );
    assert.doesNotMatch(source, /animate-pulse/);
  });
});

describe("office detail route page", () => {
  it("redirects to the offices tab when the entityId param is missing", () => {
    assert.match(routeSource, /resolveOfficeDetailEntityId/);
    assert.match(routeSource, /if \(!entityId\) redirect\(/);
    assert.match(routeSource, /\$\{routes\.ACCOUNTS\}\?tab=offices/);
  });

  it("passes entityId and the subsidiary return flag through", () => {
    assert.match(routeSource, /entityId=\{entityId\}/);
    assert.match(routeSource, /fromSubsidiary=\{fromSubsidiary\}/);
    assert.match(routeSource, /isOfficeDetailFromSubsidiary/);
    assert.match(routeSource, /rewriteLegacy/);
  });
});
