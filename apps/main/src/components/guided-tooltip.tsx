"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TooltipConfig = {
  title: string;
  description: string;
};

type DotPosition = "top-left" | "top-right" | "bottom-right";

const dotStyles: Record<DotPosition, string> = {
  "top-left": "absolute -top-3 -left-3",
  "top-right": "absolute -top-3 -right-3",
  "bottom-right": "absolute -bottom-3 -right-3",
};

interface GuidedTooltipProps {
  step: number;
  total: number;
  title: string;
  description: string;
  onSelectOther?: () => void;
  onDone?: () => void;
  onDismiss?: () => void;
  dotPosition?: DotPosition;
  className?: string;
  selectOtherLabel?: string;
  resolveLabel?: string;
}

export function GuidedTooltip({
  step,
  total,
  title,
  description,
  onSelectOther,
  onDone,
  onDismiss,
  dotPosition = "top-right",
  className,
  selectOtherLabel = "Select another method",
  resolveLabel = "Resolve",
}: Readonly<GuidedTooltipProps>) {
  const isLast = step === total - 1;

  return (
    <div
      className={cn(
        "relative w-[380px] rounded-[10px] bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <div
        className={cn(
          dotStyles[dotPosition],
          "h-6 w-6 rounded-full bg-primary-600 ring-2 ring-white",
        )}
      />

      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
        <p className="text-sm leading-5 text-gray-600">{description}</p>
      </div>

      <div className="flex items-center justify-between px-5 pb-5">
        <span className="text-sm font-semibold text-gray-900">
          {step + 1}/{total}
        </span>
        <div className="flex items-center gap-3">
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              data-testid="guided-tooltip-button"
            >
              Dismiss
            </Button>
          )}
          {onSelectOther && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSelectOther}
              data-testid="guided-tooltip-button-2"
            >
              {selectOtherLabel}
            </Button>
          )}
          {isLast && onDone && (
            <Button
              size="sm"
              onClick={onDone}
              data-testid="guided-tooltip-button-3"
            >
              {resolveLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
