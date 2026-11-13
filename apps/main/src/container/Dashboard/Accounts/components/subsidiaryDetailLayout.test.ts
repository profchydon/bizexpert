import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("SubsidiaryDetailPage layout", () => {
  it("loads entity detail from the API with loading and not-found states", () => {
    const pageSource = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/SubsidiaryDetailPage.tsx",
      ),
      "utf8",
    );

    assert.match(pageSource, /useEntityDetail/);
    assert.match(pageSource, /PageState/);
    assert.match(pageSource, /isPageLoading/);
    assert.match(pageSource, /isResumingCardCapture/);
    assert.match(pageSource, /SubsidiaryNotFound/);
    assert.match(pageSource, /SubsidiaryDetailView/);
    assert.doesNotMatch(pageSource, /CardCaptureRedirectOverlay/);
  });

  it("uses the marketplace-style page fallback while suspense resolves", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/accounts/subsidiaries/[id]/page.tsx",
      ),
      "utf8",
    );

    assert.match(source, /SubsidiaryDetailPageFallback/);
    assert.match(source, /Suspense/);
  });

  it("starts card capture from the entity detail banner", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailView.tsx",
      ),
      "utf8",
    );
    const card = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/useSubsidiaryDetailCard.ts",
      ),
      "utf8",
    );

    assert.match(card, /useEntityCardCapture/);
    assert.match(card, /beginCardCapture/);
    assert.match(card, /isCapturing/);
    assert.match(card, /outcome !== "redirect"/);
    assert.match(card, /SUBSIDIARY_DETAIL/);
    assert.match(card, /handleReplaceCard/);
    assert.doesNotMatch(source, /CardCaptureRedirectOverlay/);
    assert.match(source, /useSubsidiaryDetailClose/);
    assert.match(source, /isPrimaryEntity/);
    assert.match(source, /handleCloseEntity/);
    assert.match(source, /useSubsidiaryDetailEdit/);
    assert.match(source, /submitEdit/);
    assert.match(source, /setReplaceCardOpen\(true\)/);
    assert.match(source, /onReplaceCard=\{card\.handleReplaceCard\}/);
    assert.match(source, /onManageAdmins/);
    assert.match(source, /isReplacingCard=\{card\.isCapturing\}/);
  });

  it("uses the reference two-column card layout with instance-specific cards", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryDetailView.tsx",
      ),
      "utf8",
    );

    assert.match(source, /SubsidiaryOverviewCard/);
    assert.match(source, /pendingInvitation=\{pendingInvitation\}/);
    assert.match(source, /useOverviewPendingAdminInvitation/);
    assert.match(source, /SubsidiaryBillingCard/);
    assert.match(source, /SubsidiaryOfficesCard/);
    assert.match(source, /SubsidiaryFootprintCard/);
    assert.match(source, /SubsidiaryCostCentreCard/);
    assert.match(source, /SubsidiaryStatusBanner/);
    assert.match(source, /lg:col-span-1/);
    assert.match(source, /lg:col-span-2/);
    assert.match(source, /detail\.costCentreSpend/);
    assert.match(source, /closeChecks={detail\.closeChecks}/);
    assert.match(source, /footprint={detail\.footprint}/);
  });
});

describe("SubsidiaryFootprintCard", () => {
  it("reads counts from the detail view model instead of separate list queries", () => {
    const footprintCard = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryFootprintCard.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(footprintCard, /useEntityFootprintCounts/);
    assert.match(footprintCard, /footprint\.employees/);
    assert.match(footprintCard, /footprint\.assets/);
  });
});

describe("SubsidiaryBillingCard", () => {
  it("shows delegation-specific rows for delegated entities", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryBillingCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Billed by/);
    assert.match(source, /Delegation confirmed/);
    assert.match(source, /cost-centre reference/);
  });
});

describe("SubsidiaryOverviewCard", () => {
  it("renders credit, admins, and created metadata from subsidiary data", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryOverviewCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Credit clock/);
    assert.match(source, /label="Credit clock" value="—"/);
    assert.doesNotMatch(source, /creditClockLabel/);
    assert.match(source, /subsidiary\.admins/);
    assert.match(source, /pendingInvitation/);
    assert.match(source, /Pending invitation/);
    assert.match(source, /formatCreatedDate/);
    assert.match(source, /Created by/);
  });
});
