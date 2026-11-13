"use client";

import { useMemo } from "react";
import type { GeoFeature } from "./useWorldGeographies";
import {
  computeFraming,
  getWorldExtent,
  projectionFromFraming,
} from "../utils/fitProjection";

type Params = {
  geographies: GeoFeature[];
  activeCodes: Set<string>;
  focusCode: string | null;
  width: number;
  height: number;
};

export function useMapProjection({
  geographies,
  activeCodes,
  focusCode,
  width,
  height,
}: Params) {
  const framing = useMemo(
    () => computeFraming(geographies, activeCodes, focusCode, width, height),
    [geographies, activeCodes, focusCode, width, height],
  );
  const projection = useMemo(
    () => projectionFromFraming(framing, width, height),
    [framing, width, height],
  );
  const mapCenter = useMemo(
    () =>
      (projection.invert?.([width / 2, height / 2]) ?? [0, 0]) as [
        number,
        number,
      ],
    [projection, width],
  );
  const panExtent = useMemo<[[number, number], [number, number]]>(
    () => getWorldExtent(projection),
    [projection],
  );

  return { projection, mapCenter, panExtent };
}
