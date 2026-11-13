"use client";

import type { ComponentType } from "react";
import { ArrowNarrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

type CountryMetricRowProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href?: string;
};

export function CountryMetricRow({
  icon: Icon,
  label,
  href,
}: CountryMetricRowProps) {
  const { push, isPending } = useTransitionRouter();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-secondary bg-primary p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary">
        <Icon className="size-4 text-fg-brand-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-secondary">{label}</p>
        <p className="text-sm text-tertiary">See details</p>
      </div>
      <Button
        color="primary"
        size="sm"
        iconLeading={ArrowNarrowRight}
        isDisabled={!href}
        isLoading={isPending}
        onClick={() => href && push(href)}
        data-testid="countrymetricrow-button"
      />
    </div>
  );
}
