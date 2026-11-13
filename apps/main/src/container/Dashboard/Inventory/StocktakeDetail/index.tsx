"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { inventoryPageSectionClass } from "../inventoryPageClasses";
import {
  formatStocktakeStatus,
  isOpenStocktake,
  isPendingStocktake,
} from "../inventoryStatus";
import { StocktakeDetailActions } from "./StocktakeDetailActions";
import { StocktakeLinesTable } from "./StocktakeLinesTable";
import { useStocktakeDetail } from "./useStocktakeDetail";

export default function StocktakeDetail() {
  const { id } = useParams<{ id: string }>();
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { query, saveCounts, submit, approve, reject } = useStocktakeDetail(
    businessId,
    id,
  );
  const stocktake = query.data;
  const open = stocktake ? isOpenStocktake(stocktake.status) : false;
  const pending = stocktake ? isPendingStocktake(stocktake.status) : false;

  if (!businessId) {
    return <p className="py-8 text-secondary">No business selected.</p>;
  }

  return (
    <section className={inventoryPageSectionClass}>
      <PageHeader
        pageTitle={stocktake?.stocktakeNumber ?? "Stocktake"}
        pageDescription="Count physical inventory and post variances after approval."
        breadCrumbs={["Inventory", stocktake?.stocktakeNumber ?? "Stocktake"]}
      >
        <div className="flex items-center gap-3">
          {stocktake ? (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium capitalize text-primary-700 ring-1 ring-inset ring-primary-200">
              {formatStocktakeStatus(stocktake.status)}
            </span>
          ) : null}
          <Button
            variant="outline"
            size="md"
            isLoading={isPending}
            onClick={() => push("/dashboard/inventory")}
          >
            Back to inventory
          </Button>
        </div>
      </PageHeader>
      <StocktakeLinesTable
        lines={stocktake?.lines ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        isOpen={open}
        counts={counts}
        onCount={(lineId, value) =>
          setCounts((current) => ({ ...current, [lineId]: value }))
        }
      />
      <StocktakeDetailActions
        isOpen={open}
        isPending={pending}
        saveLoading={saveCounts.isPending}
        submitLoading={submit.isPending}
        approveLoading={approve.isPending}
        rejectLoading={reject.isPending}
        onSave={() => saveCounts.mutate(counts)}
        onSubmit={async () => {
          try {
            if (Object.keys(counts).length) {
              await saveCounts.mutateAsync(counts);
            }
            await submit.mutateAsync();
          } catch {
            return;
          }
        }}
        onApprove={() => approve.mutate()}
        onReject={() => reject.mutate()}
      />
    </section>
  );
}
