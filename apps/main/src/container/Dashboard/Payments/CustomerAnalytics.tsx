"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { CustomerAnalyticsChart } from "./CustomerAnalyticsChart";
import { CustomerAnalyticsTable } from "./CustomerAnalyticsTable";
import { buildCustomerAnalyticsMetrics } from "./customerAnalyticsMetrics";
import { PaymentsAnalyticsFilters } from "./PaymentsAnalyticsFilters";
import { PaymentsAnalyticsNav } from "./PaymentsAnalyticsNav";
import { PaymentsMetricCards } from "./PaymentsMetricCards";
import { paymentsAnalyticsQueryKeys } from "./paymentsAnalyticsQueryKeys";
import {
  defaultPaymentsAnalyticsFilters,
  paymentsAnalyticsParams,
} from "./paymentsAnalyticsRange";
import type { CustomerAnalytics as CustomerData } from "./paymentsAnalyticsTypes";
import { paymentsPageSectionClass } from "./paymentsPageClasses";

export default function CustomerAnalytics() {
  const { businessId, locations } = useBizExpertBusiness();
  const [filters, setFilters] = useState(defaultPaymentsAnalyticsFilters);

  const query = useQuery({
    queryKey: paymentsAnalyticsQueryKeys.customers(businessId ?? "", filters),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/customers`,
        { params: { ...paymentsAnalyticsParams(filters), limit: 5 } },
      );
      return res.data as CustomerData;
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
        pageTitle="Customer analytics"
        pageDescription="New and returning buyers, average spend, and top customers."
        breadCrumbs={["Payments", "Customer analytics"]}
      >
        <PaymentsAnalyticsFilters
          filters={filters}
          locations={locations}
          onChange={setFilters}
        />
      </PageHeader>
      <PaymentsAnalyticsNav />
      <PaymentsMetricCards
        metrics={buildCustomerAnalyticsMetrics(query.data)}
      />
      <CustomerAnalyticsChart
        days={query.data?.series}
        isLoading={query.isLoading}
        isError={query.isError}
      />
      <CustomerAnalyticsTable
        rows={query.data?.topCustomers}
        isLoading={query.isLoading}
        isError={query.isError}
      />
    </section>
  );
}
