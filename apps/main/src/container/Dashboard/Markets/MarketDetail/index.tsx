"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Location } from "@/types/bizexpert";
import { locationsQueryKeys } from "../../Locations/locationsQueryKeys";
import { findMarketApp } from "../marketCatalog";
import {
  dummyWebhookUrl,
  remoteOrdersFor,
  remoteProductsFor,
  remoteStoresFor,
} from "../marketDummyData";
import {
  marketsPageSectionClass,
  marketsTableShellClass,
} from "../marketsPageClasses";
import { useMarketConnections } from "../useMarketConnections";
import { ConnectStoreSlideout } from "./ConnectStoreSlideout";
import { ConnectionPanel } from "./ConnectionPanel";
import { MapProductsSlideout } from "./MapProductsSlideout";
import { marketOrderColumns } from "./orderColumns";

export default function MarketDetail() {
  const { slug } = useParams<{ slug: string }>();
  const market = findMarketApp(slug);
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const { connections, connect, disconnect, updateMapped } =
    useMarketConnections(businessId);
  const [connectOpen, setConnectOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const { data: locations } = useQuery({
    queryKey: locationsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/locations`);
      return res.data as Location[];
    },
  });

  if (!market) {
    return <p className="py-8 text-secondary">Integration not found.</p>;
  }

  const connection = connections[market.slug];
  const products = remoteProductsFor(market.slug);
  const orders = connection ? remoteOrdersFor(market.slug) : [];

  return (
    <section className={marketsPageSectionClass}>
      <PageHeader
        pageTitle={market.name}
        pageDescription={market.tagline}
        breadCrumbs={["Integrations", market.name]}
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            isLoading={isPending}
            onClick={() => push("/dashboard/integrations")}
          >
            Back
          </Button>
          {!connection ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setConnectOpen(true)}
            >
              Connect store
            </Button>
          ) : null}
        </div>
      </PageHeader>
      {connection && businessId ? (
        <ConnectionPanel
          market={market}
          connection={connection}
          webhookUrl={dummyWebhookUrl(market.slug, businessId)}
          mappedCount={connection.mappedRemoteProductIds.length}
          productCount={products.length}
          onMapProducts={() => setMapOpen(true)}
          onDisconnect={() => {
            disconnect(market.slug);
            toast.success(`${market.name} disconnected`);
          }}
        />
      ) : (
        <p className="text-sm text-gray-600">
          Connect a {market.name} store with a dummy API key to map products and
          see sample orders.
        </p>
      )}
      <div className={marketsTableShellClass}>
        <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
          {market.name} orders
        </h3>
        <DataTable data={orders} columns={marketOrderColumns()} />
      </div>
      <ConnectStoreSlideout
        isOpen={connectOpen}
        market={market}
        remoteStores={remoteStoresFor(market.slug)}
        locations={locations ?? []}
        onClose={() => setConnectOpen(false)}
        onConnect={(next) => connect(market.slug, next)}
      />
      <MapProductsSlideout
        isOpen={mapOpen}
        market={market}
        products={products}
        selectedIds={connection?.mappedRemoteProductIds ?? []}
        onClose={() => setMapOpen(false)}
        onSave={(ids) => updateMapped(market.slug, ids)}
      />
    </section>
  );
}
