import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePlanCatalog } from "./catalog";
import {
  pageNotice,
  scheduledNotice,
  statusNotice,
} from "./subscriptionNotices";
import {
  baseRate,
  canonicalPlanSlug,
  currentPlanSlug,
  officeLabel,
  planChangeMode,
  renewalBanner,
  renewalInstance,
  summaryTotal,
} from "./subscriptionView";

const payload = {
  data: {
    plans: [
      {
        id: "procure",
        name: "Procure",
        slug: "procure",
        tagline: "Source devices anywhere.",
        highlights: ["Marketplace"],
        rank: "1",
        price: { amount: "0.00", currency: "USD", unit: null },
        estimate: null,
        rates: [{ currency: "GBP", amount: "0.00", feature_id: null }],
      },
      {
        id: "scale",
        name: "Scale",
        slug: "scale",
        tagline: "No limits.",
        highlights: ["Everything in Operate", "Unlimited offices"],
        rank: "4",
        price: { amount: "12.00", currency: "USD", unit: "device" },
        estimate: {
          device_count: 338,
          amount: "4056.00",
          currency: "GBP",
          display: "£4056/mo for 338 devices",
        },
        rates: [
          { currency: "GBP", amount: "12.00", feature_id: null },
          { currency: "GBP", amount: "2.00", feature_id: "addon" },
        ],
      },
    ],
    groups: [
      {
        key: "limits",
        name: "Organisational limits",
        features: [
          {
            code: "offices",
            name: "Offices",
            cells: [
              { plan: "procure", kind: "value", label: "1" },
              { plan: "scale", kind: "value", label: "Unlimited" },
            ],
          },
          {
            code: "preferred_pricing",
            name: "Preferred pricing",
            cells: [
              { plan: "procure", kind: "excluded", label: null },
              { plan: "scale", kind: "included", label: null },
            ],
          },
        ],
      },
    ],
  },
};

describe("subscription catalog", () => {
  const catalog = parsePlanCatalog(payload);

  it("reads plans, estimates, and comparison cells from the plans payload", () => {
    assert.equal(catalog.plans[0]?.slug, "procure");
    assert.equal(catalog.plans[1]?.estimate?.deviceCount, 338);
    assert.equal(catalog.groups[0]?.features.length, 2);
    assert.equal(baseRate(catalog.plans[1], "GBP"), 12);
  });

  it("matches the live subscription slug and ignores addon rates", () => {
    const slug = currentPlanSlug(
      { plan: { name: "Scale" }, price: { plan_slug: "scale" } },
      catalog.plans,
    );
    assert.equal(slug, "scale");
    assert.equal(summaryTotal(catalog.plans[1], "GBP"), "£4,056.00");
  });

  it("reads the contract plan slug ahead of a legacy price slug", () => {
    assert.equal(
      currentPlanSlug(
        { plan: { name: "Scale", slug: "scale" }, currency: "GBP" },
        catalog.plans,
      ),
      "scale",
    );
  });

  it("maps pre-rename slugs onto the current catalog", () => {
    const withManage = parsePlanCatalog({
      data: {
        plans: [
          ...payload.data.plans,
          {
            id: "manage",
            name: "Manage",
            slug: "manage",
            tagline: "",
            highlights: [],
            rank: "2",
            price: { amount: "7.00", currency: "USD", unit: "device" },
            estimate: null,
            rates: [],
          },
        ],
        groups: [],
      },
    });
    assert.equal(canonicalPlanSlug("starter"), "manage");
    assert.equal(canonicalPlanSlug("growth"), "operate");
    assert.equal(canonicalPlanSlug("lite"), "procure");
    assert.equal(canonicalPlanSlug("premium"), "scale");
    assert.equal(canonicalPlanSlug("enterprise"), "scale");
    assert.equal(
      currentPlanSlug(
        { plan: { name: "Starter", slug: "starter" } },
        withManage.plans,
      ),
      "manage",
    );
    assert.equal(
      currentPlanSlug(
        { plan: { name: "Premium", slug: "premium" } },
        catalog.plans,
      ),
      "scale",
    );
    assert.equal(currentPlanSlug({ plan: null }, catalog.plans), "procure");
  });

  it("covers current, past-due, and lapsed renewal instances", () => {
    assert.equal(renewalInstance("active"), "current");
    assert.equal(renewalInstance("past_due"), "past-due");
    assert.equal(renewalInstance("cancelled"), "lapsed");
    assert.equal(
      renewalBanner({
        instance: "current",
        planName: "Scale",
        settleBy: "",
      }),
      null,
    );
    assert.equal(
      renewalBanner({
        instance: "past-due",
        planName: "Scale",
        settleBy: "28 February 2027",
      })?.cta,
      "See plans",
    );
    assert.match(
      renewalBanner({
        instance: "lapsed",
        planName: "Scale",
        settleBy: "",
      })?.description ?? "",
      /Subscribe again/,
    );
    assert.equal(
      statusNotice({
        status: "active",
        planName: "Scale",
        periodEnd: "",
      }),
      null,
    );
    assert.equal(
      statusNotice({
        status: "pending_payment",
        planName: "Scale",
        periodEnd: "",
      })?.kind,
      "pending",
    );
    assert.equal(
      statusNotice({
        status: "suspended",
        planName: "Scale",
        periodEnd: "",
      })?.title,
      "This account is suspended",
    );
    assert.equal(
      statusNotice({
        status: "cancelled",
        planName: "Scale",
        periodEnd: "",
      })?.kind,
      "ended",
    );
    const scheduled = scheduledNotice({
      planName: "Manage",
      at: "2027-02-28T21:22:07.000000Z",
    });
    assert.match(scheduled.description, /Manage starts on/);
    assert.equal(scheduled.cta, "Cancel change");
    assert.equal(
      pageNotice({
        status: "pending_payment",
        planName: "Procure",
        periodEnd: "24 October 2026",
        scheduled: { planName: "Manage", at: "2026-10-24" },
      })?.cta,
      "Cancel change",
    );
  });

  it("labels offices and upgrade versus switch", () => {
    assert.equal(officeLabel(catalog.groups, "scale"), "Unlimited offices");
    assert.equal(officeLabel(catalog.groups, "procure"), "Up to 1 office");
    assert.equal(
      planChangeMode(catalog.plans[1], catalog.plans[0]),
      "downgrade",
    );
    assert.equal(planChangeMode(catalog.plans[0], catalog.plans[1]), "upgrade");
  });
});
