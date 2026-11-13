"use client";

import { useEffect, useState } from "react";
import { feature } from "topojson-client";

export const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface GeoFeature {
  id: string;
  rsmKey?: string;
  properties: Record<string, unknown>;
  geometry: unknown;
}

export function useWorldGeographies(): GeoFeature[] {
  const [geographies, setGeographies] = useState<GeoFeature[]>([]);

  useEffect(() => {
    let active = true;
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((topo) => {
        if (!active) return;
        const collection = feature(topo, topo.objects.countries) as unknown as {
          features: GeoFeature[];
        };
        setGeographies(collection.features);
      })
      .catch(() => setGeographies([]));
    return () => {
      active = false;
    };
  }, []);

  return geographies;
}
