import routes from "@/routes";
import type { CustomDeviceRequest } from "./types";
import { rfqCreateRequestCountry } from "./rfqCreateRequestCountry";

export const MARKETPLACE_CREATE_RFQ_PARAM = "create_rfq";

export function rfqCreateRequestHref(request: CustomDeviceRequest) {
  const params = new URLSearchParams({
    [MARKETPLACE_CREATE_RFQ_PARAM]: "true",
  });
  const country = rfqCreateRequestCountry(request);

  if (country?.id) {
    params.set("country_id", country.id);
  }

  if (country?.name) {
    params.set("country_name", country.name);
  }

  if (country?.code) {
    params.set("country_code", country.code);
  }

  return `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?${params.toString()}`;
}
