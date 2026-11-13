"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { PaymentFormSlideout } from "./PaymentFormSlideout";
import { PaymentsAnalyticsNav } from "./PaymentsAnalyticsNav";
import { PaymentsTable } from "./PaymentsTable";
import { paymentsPageSectionClass } from "./paymentsPageClasses";

export default function Payments() {
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
    <section className={paymentsPageSectionClass}>
      <PageHeader
        pageTitle="Payments"
        pageDescription="Record cash, transfer, or POS against unpaid sales."
        breadCrumbs={["Payments"]}
      >
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          Create payment
        </Button>
      </PageHeader>
      <PaymentsAnalyticsNav />
      <PaymentsTable onCreate={() => setCreateOpen(true)} />
      <PaymentFormSlideout
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
