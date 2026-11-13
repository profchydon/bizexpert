import type { Office } from "../../types";

export function isBuyableOffice(office: Office): boolean {
  if (office.status !== "active") return false;
  if (office.type === "Physical") return Boolean(office.address);
  return true;
}
