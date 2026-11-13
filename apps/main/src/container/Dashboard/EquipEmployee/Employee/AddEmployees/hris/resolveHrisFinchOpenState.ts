import { buildHrisFinchConnectState } from "./buildHrisFinchConnectState";
import { buildHrisFinchManageState } from "./buildHrisFinchManageState";
import type { HrisFinchManageState } from "./hrisFinchManageState";
import { selectHrisFinchOpenSource } from "./selectHrisFinchOpenSource";

type Args = Parameters<typeof selectHrisFinchOpenSource>[0] & {
  code?: string | null;
  integrationParam?: string | null;
};

export function resolveHrisFinchOpenState({
  code,
  integrationParam,
  ...sourceArgs
}: Args): HrisFinchManageState | null {
  const source = selectHrisFinchOpenSource(sourceArgs);
  if (!source) {
    return null;
  }

  if (source.kind === "manage") {
    return buildHrisFinchManageState(source.integration, source.companyId);
  }

  return buildHrisFinchConnectState(source.integration, source.companyId, {
    code,
    integration: integrationParam,
  });
}
