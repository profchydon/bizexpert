import type { CustomDeviceRequest } from "./types";

export type RfqCreateRequestCountry = {
  id: string;
  name: string;
  code?: string;
};

export function rfqCreateRequestCountry(
  request: CustomDeviceRequest,
): RfqCreateRequestCountry | undefined {
  if (!request.countryId) {
    return undefined;
  }

  return {
    id: request.countryId,
    name: request.country,
    code: request.countryCode,
  };
}
