"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { CustomerFormSlideout } from "./CustomerFormSlideout";
import { CustomersTable } from "./CustomersTable";
import { customersPageSectionClass } from "./customersPageClasses";

export default function Customers() {
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
    <section className={customersPageSectionClass}>
      <PageHeader
        pageTitle="Customers"
        pageDescription="Directory, credit limits, store wallet, and outstanding balances."
        breadCrumbs={["Customers"]}
      >
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          Add customer
        </Button>
      </PageHeader>
      <CustomersTable onCreate={() => setCreateOpen(true)} />
      <CustomerFormSlideout
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
