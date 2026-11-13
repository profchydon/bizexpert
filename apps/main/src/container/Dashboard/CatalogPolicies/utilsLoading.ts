export function shouldShowPolicyDetailLoader({
  hasCompanyId,
  hasPolicy,
  isInitialLoading,
}: {
  hasCompanyId: boolean;
  hasPolicy: boolean;
  isInitialLoading: boolean;
}) {
  return !hasCompanyId || (isInitialLoading && !hasPolicy);
}
