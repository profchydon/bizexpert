import { MARKETPLACE_CREATE_RFQ_PARAM } from "@/container/Dashboard/Orders/CustomDeviceRequests/rfqCreateRequestHref";

export type MarketplaceCreateRfqCountry = {
  id?: string;
  name?: string;
  code?: string;
};

export function shouldOpenMarketplaceCreateRfq(params: URLSearchParams) {
  return params.get(MARKETPLACE_CREATE_RFQ_PARAM) === "true";
}

export function marketplaceCreateRfqCountryFromQuery(
  params: URLSearchParams,
): MarketplaceCreateRfqCountry | undefined {
  const id = params.get("country_id") ?? undefined;
  const name = params.get("country_name") ?? undefined;
  const code = params.get("country_code") ?? undefined;

  if (!id && !name && !code) {
    return undefined;
  }

  return { id, name, code };
}

export function clearMarketplaceCreateRfqQueryHref(
  pathname: string,
  params: URLSearchParams,
) {
  const nextParams = new URLSearchParams(params.toString());
  nextParams.delete(MARKETPLACE_CREATE_RFQ_PARAM);
  nextParams.delete("country_id");
  nextParams.delete("country_name");
  nextParams.delete("country_code");

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
