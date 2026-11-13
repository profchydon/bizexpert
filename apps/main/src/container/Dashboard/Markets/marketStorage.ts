import type { MarketSlug } from "./marketCatalog";

export type MarketConnection = {
  apiKey: string;
  remoteStoreId: string;
  remoteStoreName: string;
  locationId: string;
  locationName: string;
  mappedRemoteProductIds: string[];
  connectedAt: string;
};

export type MarketConnectionsState = Partial<
  Record<MarketSlug, MarketConnection>
>;

export function marketStorageKey(businessId: string): string {
  return `bizexpert.markets.${businessId}`;
}

export function parseMarketConnections(
  raw: string | null,
): MarketConnectionsState {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as MarketConnectionsState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function upsertMarketConnection(
  current: MarketConnectionsState,
  slug: MarketSlug,
  connection: MarketConnection,
): MarketConnectionsState {
  return { ...current, [slug]: connection };
}

export function removeMarketConnection(
  current: MarketConnectionsState,
  slug: MarketSlug,
): MarketConnectionsState {
  const next = { ...current };
  delete next[slug];
  return next;
}

export function readMarketConnections(
  businessId: string,
): MarketConnectionsState {
  if (typeof window === "undefined") return {};
  return parseMarketConnections(
    window.localStorage.getItem(marketStorageKey(businessId)),
  );
}

export function writeMarketConnections(
  businessId: string,
  state: MarketConnectionsState,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    marketStorageKey(businessId),
    JSON.stringify(state),
  );
}
