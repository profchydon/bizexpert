import routes from "@/routes";

export type CartDomain = "storage" | "marketplace" | "other";

export function resolveCartDomain(pathname: string): CartDomain {
  if (pathname.startsWith(routes.STORAGE)) return "storage";
  if (pathname.startsWith(routes.EQUIP_EMPLOYEE_MARKETPLACE)) {
    return "marketplace";
  }
  return "other";
}

export function shouldClearMarketplaceCart(
  previousDomain: CartDomain | null,
  nextDomain: CartDomain,
) {
  return nextDomain === "storage" && previousDomain !== "storage";
}

export function shouldClearStorageCart(
  previousDomain: CartDomain | null,
  nextDomain: CartDomain,
) {
  return nextDomain === "marketplace" && previousDomain !== "marketplace";
}
