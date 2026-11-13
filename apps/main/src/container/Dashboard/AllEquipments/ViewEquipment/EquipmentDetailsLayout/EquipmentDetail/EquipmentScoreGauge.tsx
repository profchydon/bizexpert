"use client";

import type { ComponentType } from "react";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cn } from "@/lib/utils";

const SIZE = 224;
const CENTER = SIZE / 2;
const RADIUS = 92;
const STROKE = 16;
const START = 225;
const SWEEP = 270;

function pointAt(deg: number, r = RADIUS) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)] as const;
}

function arc(startDeg: number, endDeg: number) {
  const [sx, sy] = pointAt(startDeg);
  const [ex, ey] = pointAt(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${ex} ${ey}`;
}

type Props = {
  value: number;
  icon?: ComponentType<{ className?: string }>;
  label?: string;
  variant?: "brand" | "error";
};

const EquipmentScoreGauge = ({
  value,
  icon: Icon,
  label = "Equipment score",
  variant = "brand",
}: Props) => {
  const clamped = Math.max(0, Math.min(100, value));
  const endDeg = START + (SWEEP * clamped) / 100;
  const [startX, startY] = pointAt(START);
  const [knobX, knobY] = pointAt(endDeg);
  const isError = variant === "error";

  return (
    <div
      className="relative shrink-0"
      style={{ width: SIZE, height: SIZE }}
      role="img"
      aria-label={`${Math.round(clamped)}% ${label}`}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="equipment-score-gauge-fill"
            gradientUnits="userSpaceOnUse"
            x1={startX}
            y1={startY}
            x2={knobX}
            y2={knobY}
          >
            {isError ? (
              <>
                <stop offset="0%" stopColor="var(--color-utility-error-100)" />
                <stop offset="55%" stopColor="var(--color-utility-error-400)" />
                <stop
                  offset="100%"
                  stopColor="var(--color-utility-error-600)"
                />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="var(--color-utility-brand-100)" />
                <stop offset="55%" stopColor="var(--color-utility-brand-400)" />
                <stop
                  offset="100%"
                  stopColor="var(--color-utility-brand-600)"
                />
              </>
            )}
          </linearGradient>
        </defs>

        <path
          d={arc(START, START + SWEEP)}
          fill="none"
          strokeLinecap="round"
          strokeWidth={STROKE}
          stroke="var(--color-utility-gray-100)"
        />

        {clamped > 0 ? (
          <path
            d={arc(START, endDeg)}
            fill="none"
            strokeLinecap="round"
            strokeWidth={STROKE}
            stroke="url(#equipment-score-gauge-fill)"
          />
        ) : null}

        <circle
          cx={knobX}
          cy={knobY}
          r={8}
          fill="var(--color-bg-primary)"
          stroke={
            isError
              ? "var(--color-utility-error-600)"
              : "var(--color-utility-brand-600)"
          }
          strokeWidth={3}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        {Icon ? (
          <FeaturedIcon
            icon={Icon}
            size="md"
            color={isError ? "error" : "brand"}
            theme="light"
          />
        ) : null}
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "text-display-sm font-semibold",
              isError ? "text-error-primary" : "text-primary",
            )}
          >
            {Math.round(clamped)}%
          </span>
          <span className="text-xs text-quaternary">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentScoreGauge;
