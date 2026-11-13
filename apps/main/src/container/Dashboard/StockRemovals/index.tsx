"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { StockRemovalFormSlideout } from "./StockRemovalFormSlideout";
import { StockRemovalsTable } from "./StockRemovalsTable";
import { stockRemovalsPageSectionClass } from "./stockRemovalsPageClasses";

export default function StockRemovals() {
  const { businessId } = useBizExpertBusiness();
  const [createOpen, setCreateOpen] = useState(false);

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
    <section className={stockRemovalsPageSectionClass}>
      <PageHeader
        pageTitle="Stock removals"
        pageDescription="Remove damaged, expired, or excess stock from a store."
        breadCrumbs={["Inventory", "Stock removals"]}
      >
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          Remove stock
        </Button>
      </PageHeader>
      <StockRemovalsTable onCreate={() => setCreateOpen(true)} />
      <StockRemovalFormSlideout
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
