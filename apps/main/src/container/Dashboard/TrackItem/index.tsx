"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import PageState from "@/components/PageState";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Product } from "@/types/bizexpert";
import { fetchTrackItemMatches } from "./trackItemApi";
import { trackItemPageSectionClass } from "./trackItemPageClasses";
import { trackItemQueryKeys } from "./trackItemQueryKeys";
import { TrackItemMatches } from "./TrackItemMatches";
import { TrackItemResults } from "./TrackItemResults";
import { TrackItemSearch } from "./TrackItemSearch";

export default function TrackItem() {
  const { businessId } = useBizExpertBusiness();
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const lookup = useQuery({
    queryKey: trackItemQueryKeys.lookup(businessId ?? "", query),
    enabled: !!businessId && query.length > 0,
    queryFn: () => fetchTrackItemMatches(businessId as string, query),
  });

  const matches = lookup.data ?? [];

  useEffect(() => {
    if (matches.length === 1) {
      setSelectedId(matches[0].id);
      return;
    }
    setSelectedId((current) =>
      current && matches.some((row) => row.id === current) ? current : null,
    );
  }, [matches]);

  const selected =
    matches.find((row) => row.id === selectedId) ??
    (matches.length === 1 ? matches[0] : null);

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
    <section className={trackItemPageSectionClass}>
      <PageHeader
        pageTitle="Track item"
        pageDescription="Look up a product by barcode, SKU, or name to see stock by store and movement history."
        breadCrumbs={["Inventory", "Track item"]}
      />
      <TrackItemSearch
        value={draft}
        isLoading={lookup.isFetching}
        onChange={setDraft}
        onSubmit={(next) => {
          setSelectedId(null);
          setQuery(next);
        }}
      />
      <TrackItemBody
        query={query}
        matches={matches}
        selected={selected}
        selectedId={selectedId}
        isLoading={lookup.isLoading}
        isError={lookup.isError}
        onSelect={(product) => setSelectedId(product.id)}
      />
    </section>
  );
}

type BodyProps = {
  query: string;
  matches: Product[];
  selected: Product | null;
  selectedId: string | null;
  isLoading: boolean;
  isError: boolean;
  onSelect: (product: Product) => void;
};

function TrackItemBody({
  query,
  matches,
  selected,
  selectedId,
  isLoading,
  isError,
  onSelect,
}: BodyProps) {
  if (!query) {
    return (
      <EmptyTableInstance
        title="Track an item"
        description="Scan a barcode or search by SKU or product name. Compatible with barcode scanners."
      />
    );
  }

  return (
    <PageState isLoading={isLoading} isError={isError}>
      {matches.length === 0 ? (
        <EmptyTableInstance
          title="No matching product"
          description="Try a different barcode, SKU, or product name."
        />
      ) : (
        <>
          <TrackItemMatches
            matches={matches}
            selectedId={selectedId}
            onSelect={onSelect}
          />
          {selected ? <TrackItemResults product={selected} /> : null}
        </>
      )}
    </PageState>
  );
}
