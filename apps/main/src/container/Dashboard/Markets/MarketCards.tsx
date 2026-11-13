"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarketApp } from "./marketCatalog";
import { marketInitial } from "./marketCatalog";
import type { MarketConnectionsState } from "./marketStorage";
import {
  marketCardClass,
  marketCardFooterClass,
  marketCardGridClass,
  marketCategoryClass,
  marketLogoClass,
} from "./marketsPageClasses";

type Props = {
  apps: MarketApp[];
  connections: MarketConnectionsState;
  pendingSlug: string | null;
  isPending: boolean;
  onOpen: (slug: string) => void;
};

export function MarketCards({
  apps,
  connections,
  pendingSlug,
  isPending,
  onOpen,
}: Props) {
  return (
    <div className={marketCardGridClass}>
      {apps.map((app) => {
        const connected = Boolean(connections[app.slug]);
        const loading = isPending && pendingSlug === app.slug;
        return (
          <article key={app.slug} className={marketCardClass}>
            <div className="flex items-center gap-3 pr-7">
              <div className={cn(marketLogoClass, app.logoClass)}>
                {marketInitial(app.name)}
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {app.name}
                </h3>
                <span className={marketCategoryClass}>{app.category}</span>
              </div>
            </div>
            {connected ? (
              <Check
                aria-label="Connected"
                className="absolute right-4 top-4 size-5 text-green-600"
              />
            ) : null}
            <p className="min-h-[60px] text-sm text-gray-600">{app.tagline}</p>
            <p className="text-xs text-gray-500">{app.audience}</p>
            <div className={marketCardFooterClass}>
              <Button
                variant={connected ? "outline" : "primary"}
                size="md"
                isLoading={loading}
                onClick={() => onOpen(app.slug)}
              >
                {connected ? "Manage" : "Connect"}
              </Button>
              <Button
                variant="outline"
                size="md"
                className="size-9 p-0"
                disabled={loading}
                aria-label={`Open ${app.name}`}
                onClick={() => onOpen(app.slug)}
              >
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
