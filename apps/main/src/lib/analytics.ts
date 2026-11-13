import posthog from "posthog-js";
import type { ICompany, IUser } from "@/types/auth";

type AnalyticsClient = {
  identify: (id: string, properties?: object) => void;
  group: (type: string, key: string, properties?: object) => void;
  reset: () => void;
  capture: (event: string, properties?: object) => void;
  opt_out_capturing: () => void;
  opt_in_capturing: () => void;
  has_opted_out_capturing: () => boolean;
};

let analyticsClient: AnalyticsClient = posthog;

export function setAnalyticsClientForTests(client: AnalyticsClient): void {
  analyticsClient = client;
}

export function resetAnalyticsClientForTests(): void {
  analyticsClient = posthog;
}

export interface UserIdentifyProperties {
  email: string;
  role: string;
  stage: string;
}

export interface CompanyGroupProperties {
  name: string;
  industry: string | null;
  size: string | null;
  country: string | undefined;
  currency_code: string;
}

export function safe(fn: () => void, label: string): void {
  try {
    fn();
  } catch (err) {
    console.warn(`[analytics] ${label} failed`, err);
  }
}

export function buildUserIdentifyProperties(
  user: IUser,
): UserIdentifyProperties {
  return {
    email: user.email,
    role: user.role,
    stage: user.stage,
  };
}

export function buildCompanyGroupProperties(
  company: ICompany,
): CompanyGroupProperties {
  return {
    name: company.name,
    industry: company.industry,
    size: company.size,
    country: company.country?.name,
    currency_code: company.currency_code,
  };
}

export function identifyUser(user: IUser): void {
  safe(
    () => analyticsClient.identify(user.id, buildUserIdentifyProperties(user)),
    "identifyUser",
  );
}

export function identifyCompany(company: ICompany): void {
  safe(
    () =>
      analyticsClient.group(
        "company",
        company.id,
        buildCompanyGroupProperties(company),
      ),
    "identifyCompany",
  );
}

export function resetAnalytics(): void {
  safe(() => analyticsClient.reset(), "resetAnalytics");
}

export function optOutAnalytics(): void {
  safe(() => analyticsClient.opt_out_capturing(), "optOutAnalytics");
}

export function optInAnalytics(): void {
  safe(() => analyticsClient.opt_in_capturing(), "optInAnalytics");
}

export function hasOptedOutAnalytics(): boolean {
  try {
    return analyticsClient.has_opted_out_capturing();
  } catch (err) {
    console.warn("[analytics] hasOptedOutAnalytics failed", err);
    return false;
  }
}

export function track(
  event: string,
  properties?: Record<string, unknown>,
): void {
  safe(() => analyticsClient.capture(event, properties), "track");
}
