import { getRawAppEnv, resolveAppEnv } from "./featureFlags";

export const getSentryEnvironment = (
  rawEnv: string | undefined = getRawAppEnv(),
): string => resolveAppEnv(rawEnv);
