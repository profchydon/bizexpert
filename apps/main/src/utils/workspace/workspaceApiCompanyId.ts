import { shouldAttachWorkspaceSubsidiaryParam } from "./workspaceSubsidiaryPaths";

export function resolveWorkspaceApiCompanyId(
  primaryCompanyId: string | null | undefined,
  activeEntityId: string | null | undefined,
): string | undefined {
  if (!primaryCompanyId) return undefined;
  return activeEntityId ?? primaryCompanyId;
}

export function shouldRewriteWorkspaceCompanyId(url: string): boolean {
  return shouldAttachWorkspaceSubsidiaryParam(url);
}

export function rewriteWorkspaceCompanyIdInUrl(
  url: string,
  primaryCompanyId: string,
  activeEntityId: string,
): string {
  const primaryPrefix = `/${primaryCompanyId}/`;
  if (!url.includes(primaryPrefix)) return url;
  return url.replace(primaryPrefix, `/${activeEntityId}/`);
}

export function resolveWorkspaceRequestUrl(
  url: string,
  primaryCompanyId: string | null | undefined,
  activeEntityId: string | null | undefined,
): string {
  if (!primaryCompanyId || !activeEntityId) return url;
  if (!shouldRewriteWorkspaceCompanyId(url)) return url;
  return rewriteWorkspaceCompanyIdInUrl(url, primaryCompanyId, activeEntityId);
}
