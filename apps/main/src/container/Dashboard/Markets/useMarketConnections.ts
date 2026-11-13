"use client";

import { useCallback, useEffect, useState } from "react";
import type { MarketSlug } from "./marketCatalog";
import {
  readMarketConnections,
  removeMarketConnection,
  upsertMarketConnection,
  writeMarketConnections,
  type MarketConnection,
  type MarketConnectionsState,
} from "./marketStorage";

export function useMarketConnections(businessId: string | null) {
  const [state, setState] = useState<MarketConnectionsState>({});

  useEffect(() => {
    if (!businessId) {
      setState({});
      return;
    }
    setState(readMarketConnections(businessId));
  }, [businessId]);

  const persist = useCallback(
    (next: MarketConnectionsState) => {
      if (!businessId) return;
      writeMarketConnections(businessId, next);
      setState(next);
    },
    [businessId],
  );

  const connect = useCallback(
    (slug: MarketSlug, connection: MarketConnection) => {
      persist(upsertMarketConnection(state, slug, connection));
    },
    [persist, state],
  );

  const disconnect = useCallback(
    (slug: MarketSlug) => {
      persist(removeMarketConnection(state, slug));
    },
    [persist, state],
  );

  const updateMapped = useCallback(
    (slug: MarketSlug, mappedRemoteProductIds: string[]) => {
      const current = state[slug];
      if (!current) return;
      persist(
        upsertMarketConnection(state, slug, {
          ...current,
          mappedRemoteProductIds,
        }),
      );
    },
    [persist, state],
  );

  return { connections: state, connect, disconnect, updateMapped };
}
