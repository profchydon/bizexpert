export function buildFinchRedirectPath(input: {
  companyId: string;
  provider: string;
  return_to?: string;
}): string {
  const params = new URLSearchParams({ provider: input.provider });
  if (input.return_to) {
    params.set("return_to", input.return_to);
  }
  return `/${input.companyId}/integrations/finch/redirect?${params.toString()}`;
}
