"use client";

import PageHeader from "@/components/PageHeader";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { PaymentsAnalyticsNav } from "./PaymentsAnalyticsNav";
import { PaymentTransactionsTable } from "./PaymentTransactionsTable";
import { paymentsPageSectionClass } from "./paymentsPageClasses";

export default function PaymentTransactions() {
  const { businessId } = useBizExpertBusiness();

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
        pageTitle="Transactions"
        pageDescription="Credit history for cash, transfer, and POS received on sales."
        breadCrumbs={["Payments", "Transactions"]}
      />
      <PaymentsAnalyticsNav />
      <PaymentTransactionsTable />
    </section>
  );
}
