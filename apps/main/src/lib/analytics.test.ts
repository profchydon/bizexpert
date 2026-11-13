import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ICompany, ICountry, IUser } from "@/types/auth";
import {
  buildCompanyGroupProperties,
  buildUserIdentifyProperties,
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

describe("buildUserIdentifyProperties", () => {
  it("maps identity-relevant user fields only", () => {
    assert.deepEqual(buildUserIdentifyProperties(baseUser), {
      email: "admin@rayda.com",
      role: "Admin",
      stage: "Completed",
    });
  });
});

describe("buildCompanyGroupProperties", () => {
  it("maps identity-relevant company fields, including nested country name", () => {
    assert.deepEqual(buildCompanyGroupProperties(baseCompany), {
      name: "Acme Ltd",
      industry: "Software",
      size: "51-200",
      country: "United Kingdom",
      currency_code: "GBP",
    });
  });

  it("leaves country undefined when the company has none", () => {
    const companyWithoutCountry = {
      ...baseCompany,
      country: undefined as unknown as ICountry,
    };

    assert.equal(
      buildCompanyGroupProperties(companyWithoutCountry).country,
      undefined,
    );
  });
});
