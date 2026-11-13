"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { CashflowCharts } from "./CashflowCharts";
import { buildCashflowMetrics } from "./cashflowMetrics";
import { PaymentsAnalyticsFilters } from "./PaymentsAnalyticsFilters";
import { PaymentsAnalyticsNav } from "./PaymentsAnalyticsNav";
import { PaymentsMetricCards } from "./PaymentsMetricCards";
import { paymentsAnalyticsQueryKeys } from "./paymentsAnalyticsQueryKeys";
import {
  defaultPaymentsAnalyticsFilters,
  paymentsAnalyticsParams,
} from "./paymentsAnalyticsRange";
import type { CashflowAnalytics as CashflowData } from "./paymentsAnalyticsTypes";
import { paymentsPageSectionClass } from "./paymentsPageClasses";

export default function CashflowAnalytics() {
  const { businessId, locations } = useBizExpertBusiness();
  const [filters, setFilters] = useState(defaultPaymentsAnalyticsFilters);

  const query = useQuery({
    queryKey: paymentsAnalyticsQueryKeys.cashflow(businessId ?? "", filters),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/cashflow`,
        { params: paymentsAnalyticsParams(filters) },
      );
      return res.data as CashflowData;
    },
  });

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
    <section className={paymentsPageSectionClass}>
      <PageHeader
        pageTitle="Cashflow analytics"
        pageDescription="Inflow from received payments versus outflow from stock purchases."
        breadCrumbs={["Payments", "Cashflow"]}
      >
        <PaymentsAnalyticsFilters
          filters={filters}
          locations={locations}
          onChange={setFilters}
        />
      </PageHeader>
      <PaymentsAnalyticsNav />
      <PaymentsMetricCards metrics={buildCashflowMetrics(query.data)} />
      <CashflowCharts
        days={query.data?.series}
        isLoading={query.isLoading}
        isError={query.isError}
      />
    </section>
  );
}
