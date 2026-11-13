import type { GeoProjection } from "d3-geo";
import { geoCentroid, geoEqualEarth, geoPath } from "d3-geo";
import type { GeoFeature } from "../hooks/useWorldGeographies";
import { ISO_NUMERIC_TO_ALPHA2 } from "../types";

const SINGLE_SCALE = 700;
const MIN_SCALE = 120;
const MAX_SCALE = 900;
const FALLBACK_SCALE = 140;
const SIDEBAR_INSET = 332;
const EDGE_PAD = 48;

type LngLat = [number, number];

export interface Framing {
  scale: number;
  center: LngLat;
}

function focusFeatures(
  geographies: GeoFeature[],
  activeCodes: Set<string>,
  focusCode: string | null,
): GeoFeature[] {
  return geographies.filter((geo) => {
    const alpha2 = ISO_NUMERIC_TO_ALPHA2[geo.id];
    if (!alpha2) return false;
    return focusCode ? alpha2 === focusCode : activeCodes.has(alpha2);
  });
}

export function getCountryCentroid(
  geographies: GeoFeature[],
  code: string,
): LngLat | null {
  const match = geographies.find(
    (geo) => ISO_NUMERIC_TO_ALPHA2[geo.id] === code,
  );
  return match ? (geoCentroid(match as never) as LngLat) : null;
}

export function getWorldExtent(
  projection: GeoProjection,
): [[number, number], [number, number]] {
  const [[x0, y0], [x1, y1]] = geoPath(projection).bounds({ type: "Sphere" });
  return [
    [x0, y0],
    [x1, y1],
  ];
}

function contentBox(
  width: number,
  height: number,
): {
  extent: [[number, number], [number, number]];
  translate: [number, number];
} {
  const right = Math.max(EDGE_PAD + 1, width - SIDEBAR_INSET);
  return {
    extent: [
      [EDGE_PAD, EDGE_PAD],
      [right, height - EDGE_PAD],
    ],
    translate: [(EDGE_PAD + right) / 2, height / 2],
  };
}

function fitScaleCenteredOn(
  points: LngLat[],
  center: LngLat,
  width: number,
  height: number,
): number {
  const { extent, translate } = contentBox(width, height);
  const [[x0, y0], [x1, y1]] = extent;
  const allInside = (scale: number) => {
    const projection = geoEqualEarth()
      .scale(scale)
      .center(center)
      .translate(translate);
    return points.every((point) => {
      const p = projection(point);
      return !!p && p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
    });
  };
  if (allInside(MAX_SCALE)) return MAX_SCALE;
  let lo = MIN_SCALE;
  let hi = MAX_SCALE;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (allInside(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function computeFraming(
  geographies: GeoFeature[],
  activeCodes: Set<string>,
  focusCode: string | null,
  width: number,
  height: number,
): Framing {
  const focus = focusFeatures(geographies, activeCodes, focusCode);

  if (!focus.length || width <= 0) {
    return { scale: FALLBACK_SCALE, center: [10, 15] };
  }

  const centroids = focus.map((geo) => geoCentroid(geo as never) as LngLat);
  if (centroids.length === 1) {
    return { scale: SINGLE_SCALE, center: centroids[0] };
  }

  const center = geoCentroid({
    type: "MultiPoint",
    coordinates: centroids,
  } as never) as LngLat;
  return {
    scale: fitScaleCenteredOn(centroids, center, width, height),
    center,
  };
}

export function projectionFromFraming(
  { scale, center }: Framing,
  width: number,
  height: number,
): GeoProjection {
  return geoEqualEarth()
    .scale(scale)
    .center(center)
    .translate(contentBox(width, height).translate);
}
