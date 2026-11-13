"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as CountryFlags from "@untitledui/country-flags";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  type ProjectionFunction,
} from "react-simple-maps";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { CountryTooltip } from "./CountryTooltip";
import { MapLegend } from "./MapLegend";
import { MapOverlayCard } from "./MapOverlayCard";
import { useMapProjection } from "./hooks/useMapProjection";
import { GEO_URL, useWorldGeographies } from "./hooks/useWorldGeographies";
import type { CountryEntry, TooltipState } from "./types";
import { ISO_NUMERIC_TO_ALPHA2 } from "./types";
import { getCountryCentroid } from "./utils/fitProjection";

const MAP_HEIGHT = 480;

const allowPanEventsOnly = (event: Event) =>
  event.type !== "wheel" && event.type !== "dblclick";

function getFlagComponent(
  code: string,
): ComponentType<{ className?: string }> | undefined {
  const key =
    `Flag${code[0].toUpperCase()}${code[1].toLowerCase()}` as keyof typeof CountryFlags;
  return CountryFlags[key] as ComponentType<{ className?: string }> | undefined;
}

type WorldMapProps = {
  data: CountryEntry[];
  focusCode: string | null;
  tooltip: TooltipState | null;
  onHover: (state: TooltipState | null) => void;
  onSelect: (code: string) => void;
};

export function WorldMap({
  data,
  focusCode,
  tooltip,
  onHover,
  onSelect,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const measure = useCallback(
    () => setWidth(containerRef.current?.clientWidth ?? 0),
    [],
  );
  useEffect(measure, [measure]);
  useResizeObserver({ ref: containerRef, onResize: measure });

  const geographies = useWorldGeographies();
  const activeCodes = useMemo(() => new Set(data.map((c) => c.code)), [data]);
  const mapWidth = width || 800;

  const { projection, mapCenter, panExtent } = useMapProjection({
    geographies,
    activeCodes,
    focusCode,
    width: mapWidth,
    height: MAP_HEIGHT,
  });
  const pin = useMemo(
    () => (focusCode ? getCountryCentroid(geographies, focusCode) : null),
    [geographies, focusCode],
  );

  const tooltipCountry = tooltip
    ? data.find((c) => c.code === tooltip.countryCode)
    : null;
  const tooltipFlag = tooltip
    ? getFlagComponent(tooltip.countryCode)
    : undefined;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, alpha2: string) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      onHover({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        countryCode: alpha2,
      });
    },
    [onHover],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[480px] w-full cursor-grab overflow-hidden bg-secondary/30 active:cursor-grabbing"
    >
      <MapOverlayCard />
      <ComposableMap
        projection={projection as unknown as ProjectionFunction}
        width={mapWidth}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={mapCenter}
          minZoom={1}
          maxZoom={1}
          translateExtent={panExtent}
          filterZoomEvent={(element) =>
            allowPanEventsOnly(element as unknown as Event)
          }
        >
          <Geographies geography={GEO_URL}>
            {({ geographies: geos }) =>
              geos.map((geo, i) => {
                const alpha2 = ISO_NUMERIC_TO_ALPHA2[geo.id as string];
                const isActive = alpha2 ? activeCodes.has(alpha2) : false;
                return (
                  <Geography
                    key={geo.rsmKey ?? (geo.id as string) ?? i}
                    geography={geo}
                    style={{
                      default: {
                        fill: isActive
                          ? "var(--color-bg-brand-secondary)"
                          : "var(--color-bg-tertiary)",
                        outline: "none",
                        stroke: "var(--color-bg-primary)",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: isActive
                          ? "var(--color-bg-brand-solid)"
                          : "var(--color-bg-quaternary)",
                        outline: "none",
                        cursor: isActive ? "pointer" : "default",
                      },
                      pressed: {
                        fill: isActive
                          ? "var(--color-bg-brand-solid_hover)"
                          : "var(--color-bg-tertiary)",
                        outline: "none",
                      },
                    }}
                    onMouseMove={
                      alpha2 && isActive
                        ? (e) => handleMouseMove(e, alpha2)
                        : undefined
                    }
                    onMouseLeave={isActive ? () => onHover(null) : undefined}
                    onClick={
                      alpha2 && isActive ? () => onSelect(alpha2) : undefined
                    }
                  />
                );
              })
            }
          </Geographies>
          {pin ? (
            <Marker coordinates={pin} className="pointer-events-none">
              <g transform="translate(-11, -30)">
                <path
                  d="M11 0C4.9 0 0 4.9 0 11c0 7.7 11 22 11 22s11-14.3 11-22C22 4.9 17.1 0 11 0z"
                  fill="var(--color-brand-800)"
                  stroke="var(--color-bg-primary)"
                  strokeWidth={1.5}
                />
                <circle
                  cx="11"
                  cy="11"
                  r="4.5"
                  fill="var(--color-bg-primary)"
                />
              </g>
            </Marker>
          ) : null}
        </ZoomableGroup>
      </ComposableMap>
      {tooltip && tooltipCountry ? (
        <CountryTooltip
          country={tooltipCountry}
          x={tooltip.x}
          y={tooltip.y}
          FlagComponent={tooltipFlag}
        />
      ) : null}
      <MapLegend />
    </div>
  );
}
