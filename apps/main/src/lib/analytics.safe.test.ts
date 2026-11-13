import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import type { ICompany, ICountry, IUser } from "@/types/auth";
import {
  identifyCompany,
  identifyUser,
  optInAnalytics,
  optOutAnalytics,
  resetAnalytics,
  resetAnalyticsClientForTests,
  safe,
  setAnalyticsClientForTests,
  track,
} from "./analytics";

const baseUser: IUser = {
  created_at: "2026-01-01T00:00:00.000Z",
  email: "admin@rayda.com",
  first_name: "Ada",
  id: "user_1",
  job_title: "IT Admin",
  address: "1 Rayda Way",
  last_name: "Lovelace",
  stage: "Completed",
  role: "Admin",
  status: "active",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const baseCountry: ICountry = {
  id: "country_1",
  name: "United Kingdom",
  currency_code: "GBP",
  currency_symbol: "£",
  code: "GB",
  payment_processor: "stripe",
  status: "active",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  currency_id: "currency_1",
};

const baseCompany: ICompany = {
  id: "company_1",
  sso_id: "sso_1",
  name: "Acme Ltd",
  industry: "Software",
  phone: "+441234567890",
  email: "ops@acme.com",
  address: "2 Acme Row",
  city: "London",
  state: null,
  country: baseCountry,
  size: "51-200",
  currency_code: "GBP",
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

const throwingClient = {
  identify: () => {
    throw new Error("posthog failure");
  },
  group: () => {
    throw new Error("posthog failure");
  },
  reset: () => {
    throw new Error("posthog failure");
  },
  capture: () => {
    throw new Error("posthog failure");
  },
  opt_out_capturing: () => {
    throw new Error("posthog failure");
  },
  opt_in_capturing: () => {
    throw new Error("posthog failure");
  },
  has_opted_out_capturing: () => {
    throw new Error("posthog failure");
  },
};

describe("safe", () => {
  it("swallows errors from the wrapped function", () => {
    assert.doesNotThrow(() =>
      safe(() => {
        throw new Error("boom");
      }, "testLabel"),
    );
  });
});

describe("analytics throw safety", () => {
  afterEach(() => {
    resetAnalyticsClientForTests();
  });

  it("identifyUser does not throw when posthog.identify throws", () => {
    setAnalyticsClientForTests(throwingClient);

    assert.doesNotThrow(() => identifyUser(baseUser));
  });

  it("identifyCompany does not throw when posthog.group throws", () => {
    setAnalyticsClientForTests(throwingClient);

    assert.doesNotThrow(() => identifyCompany(baseCompany));
  });

  it("resetAnalytics does not throw when posthog.reset throws", () => {
    setAnalyticsClientForTests(throwingClient);

    assert.doesNotThrow(() => resetAnalytics());
  });

  it("track does not throw when posthog.capture throws", () => {
    setAnalyticsClientForTests(throwingClient);

    assert.doesNotThrow(() => track("Test Event", { ok: true }));
  });

  it("optOutAnalytics does not throw when posthog.opt_out_capturing throws", () => {
    setAnalyticsClientForTests(throwingClient);

    assert.doesNotThrow(() => optOutAnalytics());
  });

  it("optInAnalytics does not throw when posthog.opt_in_capturing throws", () => {
    setAnalyticsClientForTests(throwingClient);

    assert.doesNotThrow(() => optInAnalytics());
  });
});
