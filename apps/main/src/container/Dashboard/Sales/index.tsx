"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { SaleFormSlideout } from "./SaleFormSlideout";
import { SalesTable } from "./SalesTable";
import { salesPageSectionClass } from "./salesPageClasses";

export default function Sales() {
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
    <section className={salesPageSectionClass}>
      <PageHeader
        pageTitle="Sales"
        pageDescription="Completed sales, payments, and outstanding balances."
        breadCrumbs={["Sales"]}
      >
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          Record sale
        </Button>
      </PageHeader>
      <SalesTable onCreate={() => setCreateOpen(true)} />
      <SaleFormSlideout
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
