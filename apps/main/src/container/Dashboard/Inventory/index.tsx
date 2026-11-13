"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { StockTransfer } from "@/types/bizexpert";
import { CancelTransferModal } from "./CancelTransferModal";
import { InventoryActionSlideout } from "./InventoryActionSlideout";
import { InventoryHeaderActions } from "./InventoryHeaderActions";
import { InventoryPanels } from "./InventoryPanels";
import { InventoryToolbar } from "./InventoryToolbar";
import { inventoryPageSectionClass } from "./inventoryPageClasses";
import type { InventoryAction, InventoryTab } from "./inventoryTabs";
import { useInventoryMutations } from "./useInventoryMutations";
import { useInventoryQueries } from "./useInventoryQueries";

export default function Inventory() {
  const { businessId, locationId, locations, setLocationId } =
    useBizExpertBusiness();
  const { push } = useTransitionRouter();
  const [tab, setTab] = useState<InventoryTab>("balances");
  const [action, setAction] = useState<InventoryAction | null>(null);
  const [search, setSearch] = useState("");
  const [cancelTransfer, setCancelTransfer] = useState<StockTransfer | null>(
    null,
  );
  const loc = locationId ?? locations[0]?.id;
  const queries = useInventoryQueries(businessId, locationId, tab);
  const mutations = useInventoryMutations(businessId, loc);

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

  const closeAction = () => setAction(null);
  const isSubmitting =
    mutations.opening.isPending ||
    mutations.receive.isPending ||
    mutations.adjust.isPending ||
    mutations.transfer.isPending;

  return (
    <section className={inventoryPageSectionClass}>
      <PageHeader
        pageTitle="Inventory"
        pageDescription="Receive stock, transfer between locations, and review movement history."
        breadCrumbs={["Inventory"]}
      >
        <InventoryHeaderActions
          onAction={setAction}
          canMutate={Boolean(loc)}
          canTransfer={locations.length >= 2}
        />
      </PageHeader>
      <InventoryToolbar
        tab={tab}
        onTab={(next) => {
          setSearch("");
          setTab(next);
        }}
        locationId={locationId}
        locations={locations}
        onLocation={setLocationId}
      />
      <InventoryPanels
        tab={tab}
        search={search}
        onSearch={setSearch}
        balances={queries.balancesQuery.data}
        balancesLoading={queries.balancesQuery.isLoading}
        balancesError={queries.balancesQuery.isError}
        transfers={queries.transfersQuery.data}
        transfersLoading={queries.transfersQuery.isLoading}
        transfersError={queries.transfersQuery.isError}
        movements={queries.movementsQuery.data}
        movementsLoading={queries.movementsQuery.isLoading}
        movementsError={queries.movementsQuery.isError}
        stocktakes={queries.stocktakesQuery.data}
        stocktakesLoading={queries.stocktakesQuery.isLoading}
        stocktakesError={queries.stocktakesQuery.isError}
        onReceive={() => setAction("receive")}
        onTransfer={() => setAction("transfer")}
        onReceiveTransfer={(id) => mutations.receiveTransfer.mutate(id)}
        onCancelTransfer={setCancelTransfer}
        onStartStocktake={async () => {
          try {
            const created = await mutations.startStocktake.mutateAsync();
            push(`/dashboard/inventory/stocktake/${created.id}`);
          } catch {
            return;
          }
        }}
        stocktakeLoading={mutations.startStocktake.isPending}
        canStartStocktake={Boolean(loc)}
      />
      <InventoryActionSlideout
        action={action}
        onClose={closeAction}
        loc={loc}
        locations={locations}
        products={queries.productsQuery.data}
        isSubmitting={isSubmitting}
        onOpening={(values) =>
          mutations.opening.mutate(values, { onSuccess: closeAction })
        }
        onReceive={(values) =>
          mutations.receive.mutate(values, { onSuccess: closeAction })
        }
        onAdjust={(values) =>
          mutations.adjust.mutate(values, { onSuccess: closeAction })
        }
        onTransfer={(values) =>
          mutations.transfer.mutate(values, { onSuccess: closeAction })
        }
      />
      {cancelTransfer ? (
        <CancelTransferModal
          isOpen
          transfer={cancelTransfer}
          isCancelling={mutations.cancelTransfer.isPending}
          onClose={() => setCancelTransfer(null)}
          onConfirm={() =>
            mutations.cancelTransfer.mutate(cancelTransfer.id, {
              onSuccess: () => setCancelTransfer(null),
            })
          }
        />
      ) : null}
    </section>
  );
}
