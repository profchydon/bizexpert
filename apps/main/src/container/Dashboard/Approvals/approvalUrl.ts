export function approvalRequestIdFromUrl(value?: string | null) {
  return value?.split("?")[0] || null;
}

export function clearApprovalRequestUrl(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  params.delete("requestId");
  params.delete("success_instance");
  params.delete("error_instance");
  params.delete("status");
  params.delete("tx_ref");

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function approvalPaymentResultUrl({
  catalogId,
  isSuccess,
  pathname,
  requestId,
}: {
  catalogId?: string | null;
  isSuccess: boolean;
  pathname: string;
  requestId?: string | null;
}) {
  const params = new URLSearchParams();
  if (catalogId) params.set("catalogId", catalogId);
  if (requestId) params.set("requestId", requestId);
  params.set(isSuccess ? "success_instance" : "error_instance", "true");
  return `${pathname}?${params.toString()}`;
}

export function approvalRequestUrl({
  catalogId,
  pathname,
  requestId,
}: {
  catalogId?: string | null;
  pathname: string;
  requestId?: string | null;
}) {
  const params = new URLSearchParams();
  if (catalogId) params.set("catalogId", catalogId);
  if (requestId) params.set("requestId", requestId);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
