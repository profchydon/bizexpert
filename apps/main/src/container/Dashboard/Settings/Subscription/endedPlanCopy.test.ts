import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { endedPlanCopy, planOnScreen } from "./endedPlanCopy";
import { pageNotice, statusNotice } from "./subscriptionNotices";

describe("ended plan", () => {
  it("names the plan that ended and the free plan the account landed on", () => {
    const copy = endedPlanCopy({
      planName: "Scale",
      endedOn: "1 September 2026",
      freePlanName: "Procure",
    });
    assert.equal(copy.title, "Your Scale plan has ended");
    assert.equal(
      copy.description,
      "The renewal went unpaid, so Scale ended on 1 September 2026 and you are on Procure. Every device, employee and record is still here. Subscribe again whenever you are ready.",
    );
    assert.equal(copy.cta, "Resubscribe to Scale");
  });

  it("omits the date and free-plan name when the contract does not have them", () => {
    const copy = endedPlanCopy({
      planName: "Scale",
      endedOn: "",
      freePlanName: "",
    });
    assert.match(copy.description, /Scale ended\./);
    assert.doesNotMatch(copy.description, /you are on/);
  });

  it("builds the cancelled notice from that copy", () => {
    const notice = statusNotice({
      status: "cancelled",
      planName: "Scale",
      periodEnd: "16 September 2026",
      freePlanName: "Procure",
    });
    assert.equal(notice?.kind, "ended");
    assert.equal(notice?.tone, "neutral");
    assert.equal(notice?.cta, "Resubscribe to Scale");
    assert.equal(
      notice?.description,
      "The renewal went unpaid, so Scale ended on 16 September 2026 and you are on Procure. Every device, employee and record is still here. Subscribe again whenever you are ready.",
    );
  });

  it("resubscribes to the plan in expired_from while the account is active", () => {
    const notice = pageNotice({
      status: "active",
      planName: "Procure",
      periodEnd: "30 October 2026",
      expiredFrom: {
        planName: "Scale",
        endedOn: "16 August 2026",
        currentPlanName: "Procure",
      },
      scheduled: null,
    });
    assert.equal(notice?.kind, "ended");
    assert.equal(notice?.cta, "Resubscribe to Scale");
    assert.match(notice?.description ?? "", /Scale ended on 16 August 2026/);
    assert.match(notice?.description ?? "", /you are on Procure/);
    assert.doesNotMatch(notice?.title ?? "", /Procure plan has ended/);
  });

  it("shows the free plan once a paid plan has ended", () => {
    const scale = { amount: 12, slug: "scale" };
    const procure = { amount: 0, slug: "procure" };
    assert.equal(planOnScreen(true, scale, procure), procure);
    assert.equal(planOnScreen(false, scale, procure), scale);
    assert.equal(planOnScreen(true, procure, procure), procure);
    assert.equal(planOnScreen(true, scale, undefined), scale);
  });
});
