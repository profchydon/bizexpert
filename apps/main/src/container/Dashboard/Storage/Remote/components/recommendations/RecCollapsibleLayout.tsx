"use client";

import { ChevronDown, Lightbulb02 } from "@untitledui/icons";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { RecLayoutProps } from "../../utils/recommendations";

export function RecCollapsibleLayout({ recommendations }: RecLayoutProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-secondary bg-primary">
      <Tooltip title="Coming soon">
        <TooltipTrigger className="flex w-full cursor-not-allowed outline-hidden">
          <span
            aria-disabled="true"
            className="flex w-full items-center gap-2 px-4 py-3 text-left opacity-60"
          >
            <Lightbulb02 className="size-4 text-fg-brand-primary" />
            <h3 className="text-sm font-semibold text-primary">
              Recommended for you
            </h3>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              {recommendations.length}
            </span>
            <ChevronDown className="ml-auto size-4 text-quaternary" />
          </span>
        </TooltipTrigger>
      </Tooltip>
    </section>
  );
}
