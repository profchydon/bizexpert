"use client";

import PageState from "@/components/PageState";
import TotalSumOrderSummary from "./TotalSumOrderSummary";
import TotalSumOrderSummaryLegacy from "./TotalSumOrderSummaryLegacy";
import { useSearchParams } from "next/navigation";

const StorageTotalSumOrderSummary = () => {
  const renewStorage = useSearchParams().get("r_int");

  return (
    <PageState isLoading={false} isError={false}>
      {renewStorage ? <TotalSumOrderSummaryLegacy /> : <TotalSumOrderSummary />}
    </PageState>
  );
};

export default StorageTotalSumOrderSummary;
