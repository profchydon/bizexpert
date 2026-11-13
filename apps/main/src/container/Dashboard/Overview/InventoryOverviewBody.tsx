"use client";

import PageHeader from "@/components/PageHeader";
import { buildInventoryOverviewMetrics } from "./inventoryOverviewMetrics";
import {
  inventoryOverviewPageClass,
  inventoryOverviewTwoColumnClass,
} from "./inventoryOverviewClasses";
import { InventoryMetricCards } from "./InventoryMetricCards";
import { InventorySalesTrendChart } from "./InventorySalesTrendChart";
import { InventoryLowStockTable } from "./InventoryLowStockTable";
import { InventoryTopProductsTable } from "./InventoryTopProductsTable";
import { InventoryLocationTable } from "./InventoryLocationTable";
import { useInventoryOverview } from "./useInventoryOverview";

export function InventoryOverviewBody() {
  const overview = useInventoryOverview();

  if (!overview.businessId) {
    return (
      <p className="py-8 text-secondary">
        No business selected.{" "}
        <a href="/onboarding/business" className="text-brand-600 underline">
          Create one
        </a>
      </p>
    );
  }

  const metrics = buildInventoryOverviewMetrics(
    overview.summary.data,
    overview.collections.data,
    overview.valuation.data?.totalValue,
  );

  return (
    <section className={inventoryOverviewPageClass}>
      <PageHeader
        pageTitle="Overview"
        pageDescription="Sales, collections, and inventory for the last 30 days."
        breadCrumbs={["Overview"]}
      />
      <InventoryMetricCards metrics={metrics} />
      <div className={inventoryOverviewTwoColumnClass}>
        <InventorySalesTrendChart
          data={overview.chart.data}
          isLoading={overview.chart.isLoading}
          isError={overview.chart.isError}
        />
        <InventoryLowStockTable
          rows={overview.lowStock.data}
          isLoading={overview.lowStock.isLoading}
          isError={overview.lowStock.isError}
        />
      </div>
      <div className={inventoryOverviewTwoColumnClass}>
        <InventoryTopProductsTable
          rows={overview.topProducts.data}
          isLoading={overview.topProducts.isLoading}
          isError={overview.topProducts.isError}
        />
        <InventoryLocationTable
          rows={overview.locations.data}
          isLoading={overview.locations.isLoading}
          isError={overview.locations.isError}
        />
      </div>
    </section>
  );
}
