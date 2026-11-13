import type { OfficeParent, Subsidiary } from "../../types";

export function toOfficeParent(subsidiary: Subsidiary): OfficeParent {
  return {
    id: subsidiary.id,
    name: subsidiary.name,
    region: subsidiary.region,
    currency: subsidiary.currency,
    officesCount: subsidiary.officesCount,
  };
}
