export type AppEnv = "development" | "staging" | "production";

const FLAG_ENV_SUFFIX: Record<AppEnv, "dev" | "staging" | "prod"> = {
  development: "dev",
  staging: "staging",
  production: "prod",
};

export const resolveAppEnv = (rawEnv?: string | null): AppEnv => {
  switch (rawEnv) {
    case "production":
      return "production";
    case "staging":
      return "staging";
    default:
      return "development";
  }
};

export const withEnvSuffix = (
  baseKey: string,
  rawEnv?: string | null,
): string => `${baseKey}_${FLAG_ENV_SUFFIX[resolveAppEnv(rawEnv)]}`;

export const getRawAppEnv = (): string | undefined =>
  (process.env.NEXT_PUBLIC_APP_ENV as string | undefined) ??
  (process.env.NODE_ENV as string | undefined);

export const FEATURE_FLAGS = {
  ORDER_SCREEN_UI_UPDATE: withEnvSuffix(
    "remote_orderScreen_ui_update",
    getRawAppEnv(),
  ),
  ORDER_FLOWS_UI_UPDATE: withEnvSuffix(
    "remote_orderFlows_ui_update",
    getRawAppEnv(),
  ),
  ACCOUNT_MANAGEMENT: withEnvSuffix("remote_accountManagement", getRawAppEnv()),
  REMOTE_STORAGE: withEnvSuffix("remote_storage", getRawAppEnv()),
  NEW_ONBOARDING: withEnvSuffix("remote_newOnboarding", getRawAppEnv()),
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
export type FeatureFlagName = (typeof FEATURE_FLAGS)[FeatureFlagKey];
