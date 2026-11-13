"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchWithIcon from "@/components/SearchWithIcon";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { filterMarketsBySearch } from "./filterMarketsBySearch";
import { MARKET_APPS } from "./marketCatalog";
import { MarketCards } from "./MarketCards";
import { marketsPageSectionClass } from "./marketsPageClasses";
import { useMarketConnections } from "./useMarketConnections";

export default function Markets() {
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [search, setSearch] = useState("");
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const { connections } = useMarketConnections(businessId);

  const apps = useMemo(
    () => filterMarketsBySearch(MARKET_APPS, search),
    [search],
  );

  if (!businessId) {
    return (
      <p className="py-8 text-secondary">
        No business selected.{" "}
        <a href="/onboarding/business" className="text-brand-600 underline">
          Create one
        </a>
      </p>
    );
  }

  return (
    <section className={marketsPageSectionClass}>
      <PageHeader
        pageTitle="Integrations"
        pageDescription="Connect Jumia, Konga, and Jiji to sync stores, products, and orders."
        breadCrumbs={["Integrations"]}
      />
      <SearchWithIcon
        className="w-full sm:w-[310px]"
        placeholder="Search integrations"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <MarketCards
        apps={apps}
        connections={connections}
        pendingSlug={pendingSlug}
        isPending={isPending}
        onOpen={(slug) => {
          setPendingSlug(slug);
          push(`/dashboard/integrations/${slug}`);
        }}
      />
    </section>
  );
}
